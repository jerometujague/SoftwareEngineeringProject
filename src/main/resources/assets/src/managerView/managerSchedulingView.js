import $ from 'jquery';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { EditDialog, EditorData, EditItem } from './editDialog';
import { getTopResults, convertTime24to12, convertTime12to24 } from '../functions';
import HeaderFilters from './headerFilters';

export default class ManagerSchedulingView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditDialog: false,
            editorData: undefined,
            filters: [[], [], []],
        }
    }

    editManagerUnavailable(index, id, ...items) {
        items.pop();
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(id, items, [], index * 35 + 87),
        })
    }

    addManagerUnavailable(editItems) {
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(-1, editItems, [], this.props.managerUnavailables.length * 35 + 93),
        })
    }

    async deleteManagerUnavailable(id) {
        this.props.setStateValue('loading', true);

        await $.ajax({
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/unavailables/manager/delete/' + id + '/'
        });

        await this.props.loadData('managerUnavailables');
        this.props.setStateValue('loading', false);
    }

    async saveEdits(id, newValues) {
        this.props.setStateValue('loading', true);

        const dateArray = newValues[0].split('-');
        const date = this.props.calendar.find(c => c.date[0] == '20' + dateArray[2] && c.date[1] == dateArray[0] && c.date[2] == dateArray[1]);
        const time = convertTime12to24(newValues[1]);
        const manager = this.props.managers.find(m => (m.firstName + " " + m.lastName) == newValues[2]);

        const validTime = time.match('^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$');

        // Check if the data is valid
        if (!date || !validTime || !manager) {
            const newEditorData = this.state.editorData;

            if (!date) {
                newEditorData[0] = "Invalid date";
            }

            if (!validTime) {
                newEditorData[1] = "Invalid time";
            }

            if (!manager) {
                newEditorData[2] = "Invalid name";
            }

            this.setState({
                editorData: newEditorData,
            })

            this.props.setStateValue('loading', false);
            return;
        }

        const calendarId = date.calendarId;
        const managerId = manager.id;

        if (id == -1) {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/unavailables/manager/add',
                data: JSON.stringify({
                    calendarId: calendarId,
                    time: time,
                    referId: managerId,
                })
            });
        } else {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/unavailables/manager/update',
                data: JSON.stringify({
                    id: id,
                    calendarId: calendarId,
                    time: time,
                    referId: managerId,
                })
            });
        }

        await this.props.loadData('managerUnavailables');
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
            filters: [[], [], []],
        })
    }

    getManagerName(id) {
        return this.props.managers.find(m => { return m.id == id }).firstName + " " + this.props.managers.find(m => { return m.id == id }).lastName;
    }

    getDate(id) {
        const date = this.props.calendar.find(c => { return c.calendarId == id }).date;
        return date[1] + "-" + date[2] + "-" + String(date[0]).slice(2);
    }

    render() {
        const headerNames = ['Date', 'Time', 'Manager'];

        // Filter options
        const filterOptions = [
            getTopResults(this.props.managerUnavailables.map(a => a.calendarId)).map(r => this.getDate(r.item)),
            getTopResults(this.props.managerUnavailables.map(a => a.time[0])).map(r => convertTime24to12(r.item)),
            getTopResults(this.props.managerUnavailables.map(m => m.referId)).map(r => this.getManagerName(r.item))];

        const newEditItems = [
            new EditItem('Date', '', filterOptions[0]),
            new EditItem('Time', '', filterOptions[1]),
            new EditItem('Manager', '', getTopResults(this.props.managers.map(m => m.id)).map(r => this.getManagerName(r.item)))];

        return (
            <div className="mainViewHolder">
                <h2 className="viewHeader">Manager Scheduling</h2>
                {
                    // Show a clear all link if there is a filter
                    (this.state.filters[0].length > 0 ||
                        this.state.filters[1].length > 0 ||
                        this.state.filters[2].length > 0) &&
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
                            this.props.managerUnavailables.map((managerUnavailable, index) => {
                                const tableData = [];
                                tableData.push(new EditItem('Date', this.getDate(managerUnavailable.calendarId), filterOptions[0]));
                                tableData.push(new EditItem('Time', convertTime24to12(managerUnavailable.time[0]), filterOptions[1]));
                                tableData.push(new EditItem('Manager', this.getManagerName(managerUnavailable.referId), newEditItems[2].options));

                                // Check for filtering
                                for (let i = 0; i < tableData.length - 1; i++) {
                                    if (this.state.filters[i].length > 0 && !this.state.filters[i].includes(tableData[i].value)) {
                                        return;
                                    }
                                }

                                return (
                                    <tr key={managerUnavailable.id}>
                                        {
                                            tableData.map((data, index) => {
                                                return <td key={index} className="tableData">{data.value}</td>;
                                            })
                                        }
                                        <td className="tableData actionStart">
                                            <input type="submit" value="Edit" onClick={this.editManagerUnavailable.bind(this, index, managerUnavailable.id, ...tableData)} />
                                        </td>
                                        <td className="tableData">
                                            <input type="submit" value="Delete" onClick={this.deleteManagerUnavailable.bind(this, managerUnavailable.id)} />
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <input type="submit" value="Add new manager unavailability" className="newItemButton" onClick={this.addManagerUnavailable.bind(this, newEditItems)} />
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