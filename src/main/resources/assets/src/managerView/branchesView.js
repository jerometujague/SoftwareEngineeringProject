import $ from 'jquery';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { EditDialog, EditorData, EditItem } from './editDialog';
import { getTopResults } from '../functions';
import HeaderFilters from './headerFilters';

export default class BranchesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditDialog: false,
            editorData: undefined,
            filters: [[], [], [], [], []],
        }
    }

    editBranch(index, id, ...items) {
        items.pop();
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(id, items, []),
        })
    }

    addBranch(editItems) {
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(-1, editItems, []),
        })
    }

    async deleteBranch(id) {
        this.props.setStateValue('loading', true);

        await $.ajax({
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/branches/delete/' + id + '/'
        });

        await this.props.loadData('branches');
        this.props.setStateValue('loading', false);
    }

    async saveEdits(id, newValues) {
        this.props.setStateValue('loading', true);

        const name = newValues[0];
        const streetAddress = newValues[1];
        const city = newValues[2];
        const state = newValues[3];
        const zipCode = newValues[4];

        // Check if the data is valid
        if (!name || !streetAddress || !city || !state || !zipCode) {
            const newEditorData = this.state.editorData;

            if (!name) {
                newEditorData[0] = "Invalid name";
            }

            if (!streetAddress) {
                newEditorData[1] = "Invalid street address";
            }

            if (!city) {
                newEditorData[2] = "Invalid city";
            }

            if (!state) {
                newEditorData[3] = "Invalid state";
            }

            if (!zipCode) {
                newEditorData[4] = "Invalid zip code";
            }

            this.setState({
                editorData: newEditorData,
            })

            this.props.setStateValue('loading', false);
            return;
        }

        if (id == -1) {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/branches/add',
                data: JSON.stringify({
                    name: name,
                    streetAddress: streetAddress,
                    city: city,
                    state: state,
                    zipCode: zipCode,
                })
            });
        } else {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/branches/update',
                data: JSON.stringify({
                    id: id,
                    name: name,
                    streetAddress: streetAddress,
                    city: city,
                    state: state,
                    zipCode: zipCode,
                })
            });
        }

        await this.props.loadData('branches');
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
            filters: [[], [], [], [], []],
        })
    }

    render() {
        const headerNames = ['Name', 'Street Address', 'City', 'State', 'Zip Code'];

        // Filter options for city and state
        const filterOptions = [[], [], getTopResults(this.props.branches.map(b => b.city)).map(r => r.item), getTopResults(this.props.branches.map(b => b.state)).map(r => r.item), []];

        const newEditItems = [
            new EditItem('Name', ''),
            new EditItem('Street Address', ''),
            new EditItem('City', ''),
            new EditItem('State', ''),
            new EditItem('Zip Code', '')];

        return (
            <div className="mainViewHolder">
                <h2 className="viewHeader">Branches</h2>
                {
                    // Show a clear all link if there is a filter
                    (this.state.filters[2].length > 0 ||
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
                            this.props.branches.map((branch, index) => {
                                const tableData = [];
                                tableData.push(new EditItem('Name', branch.name));
                                tableData.push(new EditItem('Street Address', branch.streetAddress));
                                tableData.push(new EditItem('City', branch.city));
                                tableData.push(new EditItem('State', branch.state));
                                tableData.push(new EditItem('Zip Code', branch.zipCode));

                                // Check for filtering
                                if (this.state.filters[2].length > 0 && !this.state.filters[2].includes(tableData[2].value) &&
                                    this.state.filters[3].length > 0 && !this.state.filters[3].includes(tableData[3].value)) {
                                    return;
                                }

                                return (
                                    <tr key={branch.id}>
                                        {
                                            tableData.map((data, index) => {
                                                return <td key={index} className="tableData">{data.value}</td>;
                                            })
                                        }
                                        <td className="tableData actionStart">
                                            <input type="submit" value="Edit" onClick={this.editBranch.bind(this, index, branch.id, ...tableData)} />
                                        </td>
                                        <td className="tableData">
                                            <input type="submit" value="Delete" onClick={this.deleteBranch.bind(this, branch.id)} />
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <input type="submit" value="Add new branch" className="newItemButton" onClick={this.addBranch.bind(this, newEditItems)} />
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
                <CSSTransition // Show the gray out
                    in={this.state.showEditDialog}
                    timeout={400}
                    classNames="gray"
                    unmountOnExit>
                    <div id="grayout"></div>
                </CSSTransition>
            </div>
        );
    }
}