import $ from 'jquery';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { EditDialog, EditorData, EditItem } from './editDialog';
import { getTopResults, convertTime24to12, convertTime12to24, convertIntToDay, convertDayToInt } from '../functions';
import HeaderFilters from './headerFilters';

export default class BranchHoursView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditDialog: false,
            editorData: undefined,
            filters: [[], [], [], []],
        }
    }

    editBranchHours(index, id, ...items) {
        items.pop();
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(id, items, [], index * 35 + 87),
        })
    }

    addBranchHours(editItems) {
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(-1, editItems, [], this.props.branchHours.length * 35 + 93),
        })
    }

    async deleteBranchHours(id) {
        this.props.setStateValue('loading', true);

        await $.ajax({
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/branchHours/delete/' + id + '/'
        });

        await this.props.loadData('branchHours');
        this.props.setStateValue('loading', false);
    }

    async saveEdits(id, newValues) {
        this.props.setStateValue('loading', true);

        const openTime = convertTime12to24(newValues[0]);
        const closeTime = convertTime12to24(newValues[1]);
        const branch = this.props.branches.find(b => b.name == newValues[2]);
        const dayOfWeek = convertDayToInt(newValues[3]);

        // Check if the data is valid
        if (!openTime || !closeTime || !branch || !dayOfWeek) {
            const newEditorData = this.state.editorData;

            if (!openTime) {
                newEditorData.editErrors[0] = "Invalid open time";
            }

            if (!closeTime) {
                newEditorData.editErrors[1] = "Invalid close time";
            }

            if (!branch) {
                newEditorData.editErrors[2] = "Invalid name";
            }

            if (!dayOfWeek) {
                newEditorData.editErrors[3] = "Invalid day of week";
            }

            this.setState({
                editorData: newEditorData,
            })

            this.props.setStateValue('loading', false);
            return;
        }

        const branchId = branch.id;

        if (id == -1) {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/branchHours/add',
                data: JSON.stringify({
                    openTime: openTime,
                    closeTime: closeTime,
                    branchId: branchId,
                    dayOfWeek: dayOfWeek,
                })
            });
        } else {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/branchHours/update',
                data: JSON.stringify({
                    openTime: openTime,
                    closeTime: closeTime,
                    branchId: branchId,
                    dayOfWeek: dayOfWeek,
                    id: id,
                })
            });
        }

        await this.props.loadData('branchHours');
        this.props.setStateValue('loading', false);

        this.setState({
            showEditDialog: false,
        })
    }

    closeEditor() {
        this.setState({
            showEditDialog: false,
        })
    }

    setFilters(newFilters) {
        this.setState({
            filters: newFilters,
        })
    }

    clearFilters() {
        this.setState({
            filters: [[], [], [], []],
        })
    }

    getBranchName(id) {
        return this.props.branches.find(b => { return b.id == id }).name;
    }

    getDate(id) {
        const date = this.props.calendar.find(c => { return c.calendarId == id }).date;
        return date[1] + "-" + date[2] + "-" + String(date[0]).slice(2);
    }

    render() {
        const headerNames = ['Open Time', 'Close Time', 'Branch', 'Day Of Week'];

        // Filter options
        const filterOptions = [
            getTopResults(this.props.branchHours.map(a => a.openTime[0])).map(r => convertTime24to12(r.item)),
            getTopResults(this.props.branchHours.map(a => a.closeTime[0])).map(r => convertTime24to12(r.item)),
            getTopResults(this.props.branchHours.map(b => b.branchId)).map(r => this.getBranchName(r.item)),
            getTopResults(this.props.branchHours.map(h => h.dayOfWeek)).map(r => convertIntToDay(parseInt(r.item)))];

        const newEditItems = [
            new EditItem('Open Time', '', filterOptions[0]),
            new EditItem('Close Time', '', filterOptions[1]),
            new EditItem('Branch', '', getTopResults(this.props.branches.map(b => b.id)).map(r => this.getBranchName(r.item))),
            new EditItem('Day Of Week', '', filterOptions[3])];

        return (
            <div className="mainViewHolder">
                <h2 className="viewHeader">Branch Hours</h2>
                {
                    // Show a clear all link if there is a filter
                    (this.state.filters[0].length > 0 ||
                        this.state.filters[1].length > 0 ||
                        this.state.filters[2].length > 0 ||
                        this.state.filters[3].length > 0) &&
                    <a onClick={this.clearFilters.bind(this)}>Clear all current filters</a>
                }
                <table>
                    <thead>
                        <tr>
                            <HeaderFilters
                                headerNames={headerNames}
                                filterOptions={filterOptions}
                                filters={this.state.filters}
                                setFilters={this.setFilters.bind(this)} />
                            <td colSpan="2"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.branchHours.map((branchHour, index) => {
                                const tableData = [];
                                tableData.push(new EditItem('Open Time', convertTime24to12(branchHour.openTime[0]), filterOptions[0]));
                                tableData.push(new EditItem('Close Time', convertTime24to12(branchHour.closeTime[0]), filterOptions[1]));
                                tableData.push(new EditItem('Branch', this.getBranchName(branchHour.branchId), newEditItems[2].options));
                                tableData.push(new EditItem('Day Of Week', convertIntToDay(branchHour.dayOfWeek), filterOptions[3]));

                                // Check for filtering
                                for (let i = 0; i < tableData.length; i++) {
                                    if (this.state.filters[i].length > 0 && !this.state.filters[i].includes(tableData[i].value)) {
                                        return;
                                    }
                                }

                                return (
                                    <tr key={branchHour.id}>
                                        {
                                            tableData.map((data, index) => {
                                                return <td key={index} className="tableData">{data.value}</td>;
                                            })
                                        }
                                        <td className="tableData actionStart">
                                            <input type="submit" value="Edit" onClick={this.editBranchHours.bind(this, index, branchHour.id, ...tableData)} />
                                        </td>
                                        <td className="tableData">
                                            <input type="submit" value="Delete" onClick={this.deleteBranchHours.bind(this, branchHour.id)} />
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <input type="submit" value="Add new branch hours" className="newItemButton" onClick={this.addBranchHours.bind(this, newEditItems)} />
                <CSSTransition // Show the edit dialog
                    in={this.state.showEditDialog}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <EditDialog
                        editorData={this.state.editorData}
                        saveHandler={this.saveEdits.bind(this)}
                        closeHandler={this.closeEditor.bind(this)} />
                </CSSTransition>
            </div>
        );
    }
}