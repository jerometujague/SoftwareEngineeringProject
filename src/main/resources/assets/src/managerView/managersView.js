import $ from 'jquery';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import EditDialog from './editDialog';
import { getTopResults } from '../functions';
import HeaderFilters from './headerFilters';

export default class ManagersView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            managers: [],
            branches: [],
            showEditDialog: false,
            editPosition: 0,
            editId: 0,
            editItems: [],
            filters: [[], [], [], []],
        }

        this.dataNeeded = ['branches', 'managers'];
        this.loadData();
    }

    async loadData() {
        this.props.setStateValue('loading', true);

        for (let data of this.dataNeeded) {
            const url = "/api/" + data;

            await $.getJSON(url, dataList => {
                const newData = [];
                dataList.forEach(dataItem => {
                    newData.push(dataItem);
                });

                this.setState({
                    [data]: newData,
                });
            });
        }

        this.props.setStateValue('loading', false);
    }

    editManager(index, id, name, email, phoneNumber, branch) {
        this.setState({
            showEditDialog: true,
            editPosition: index * 35 + 87,
            editId: id,
            editItems: [name, email, phoneNumber, branch],
        })
    }

    addManager() {
        this.setState({
            showEditDialog: true,
            editPosition: this.state.managers.length * 35 + 93,
            editId: -1,
            editItem: "",
        })
    }

    async deleteManager(id) {
        this.props.setStateValue('loading', true);

        await $.ajax({
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/managers/delete/' + id + '/'
        });

        this.loadManagers();

        this.props.setStateValue('loading', false);
    }

    async saveEdits(id, newValues) {
        this.props.setStateValue('loading', true);

        if (id == -1) {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/managers/add',
                data: JSON.stringify({
                    service: newValues[0]
                })
            });
        } else {
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/managers/update',
                data: JSON.stringify({
                    id: id,
                    service: newValues[0]
                })
            });
        }

        await this.loadManagers();

        this.setState({
            showEditDialog: false,
        })

        this.props.setStateValue('loading', false);
    }

    closeEditor() {
        this.setState({
            showEditDialog: false,
        })
    }

    getBranchName(id) {
        return this.state.branches.find(b => { return b.id == id }).name;
    }

    setFilters(newFilters) {
        this.setState({
            filters: newFilters,
        })
    }

    render() {
        const headerNames = ['Manager', 'Phone number', 'Email', 'Branch'];

        // Only show filter options for branch
        const filterOptions = [[], [], [], getTopResults(this.state.managers.map(m => m.branchId)).map(r => this.getBranchName(r.item))];

        return (
            <div className="mainViewHolder">
                <h2 className="viewHeader">Managers</h2>
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
                            this.state.managers.map((manager, index) => {
                                const name = manager.firstName + " " + manager.lastName;
                                const branch = this.getBranchName(manager.branchId);

                                return (
                                    <tr key={manager.id}>
                                        <td className="tableData">{name}</td>
                                        <td className="tableData">{manager.phoneNumber}</td>
                                        <td className="tableData">{manager.email}</td>
                                        <td className="tableData">{branch}</td>
                                        <td className="tableData actionStart">
                                            <input type="submit" value="Edit" onClick={this.editManager.bind(this, index, manager.id, name, manager.phoneNumber, manager.email, branch)} />
                                        </td>
                                        <td className="tableData">
                                            <input type="submit" value="Delete" onClick={this.deleteManager.bind(this, manager.id)} />
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <input type="submit" value="Add new manager" className="newItemButton" onClick={this.addManager.bind(this)} />
                <CSSTransition // Show the edit dialog
                    in={this.state.showEditDialog}
                    timeout={400}
                    classNames="view"
                    unmountOnExit>
                    <EditDialog
                        editId={this.state.editId}
                        editItems={this.state.editItems}
                        saveHandler={this.saveEdits.bind(this)}
                        closeHandler={this.closeEditor.bind(this)}
                        topPosition={this.state.editPosition + "px"} />
                </CSSTransition>
            </div>
        );
    }
}