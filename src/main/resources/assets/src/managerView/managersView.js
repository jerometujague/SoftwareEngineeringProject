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
            editErrors: [],
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
            editItems: ["", "", "", ""],
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

        this.loadData();

        this.props.setStateValue('loading', false);
    }

    async saveEdits(id, newValues) {
        this.props.setStateValue('loading', true);

        const names = newValues[0].split(' ');

        const firstName = names[0];
        const lastName = names[1];
        const phoneNumber = newValues[1].replace(/\(|\)|\s|-/g, '');
        const email = newValues[2];
        const branch = this.state.branches.find(b => b.name == newValues[3]);

        const validPhoneNumber = phoneNumber.length == 10;
        const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const validEmail = pattern.test(email);

        if (!branch || !validPhoneNumber || !validEmail) {
            const newEditErrors = this.state.editErrors;

            if (!validPhoneNumber) {
                newEditErrors[1] = "Invalid phone number";
            }

            if (!validEmail) {
                newEditErrors[2] = "Invalid email";
            }

            if (!branch) {
                newEditErrors[3] = "Invalid branch";
            }

            this.setState({
                editErrors: newEditErrors,
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
                url: '/api/managers/add',
                data: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    email: email,
                    branchId: branchId,
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
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    email: email,
                    branchId: branchId,
                })
            });
        }

        await this.loadData();

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

    getPhoneNumber(phone) {
        let phoneNumber = "";
        for (let i = 0; i < phone.length; i++) {
            if (i == 0) {
                phoneNumber += '(';
            }

            phoneNumber += phone.charAt(i);

            if (i == 2) {
                phoneNumber += ') ';
            }

            if (i == 5) {
                phoneNumber += '-';
            }

        }

        return phoneNumber;
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

    render() {
        const headerNames = ['Manager', 'Phone number', 'Email', 'Branch'];

        // Only show filter options for branch
        const filterOptions = [[], [], [], getTopResults(this.state.managers.map(m => m.branchId)).map(r => this.getBranchName(r.item))];

        const editOptions = [[], [], [], getTopResults(this.state.branches.map(b => b.id)).map(r => this.getBranchName(r.item))];

        return (
            <div className="mainViewHolder">
                <h2 className="viewHeader">Managers</h2>
                {
                    // Show a clear all link if there is a filter
                    this.state.filters[3].length > 0 &&
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
                            this.state.managers.map((manager, index) => {
                                const name = manager.firstName + " " + manager.lastName;
                                const branch = this.getBranchName(manager.branchId);
                                const phoneNumber = this.getPhoneNumber(manager.phoneNumber);

                                // Check for filtering
                                if (this.state.filters[3].length > 0 && !this.state.filters[3].includes(branch)) {
                                    return;
                                }

                                return (
                                    <tr key={manager.id}>
                                        <td className="tableData">{name}</td>
                                        <td className="tableData">{phoneNumber}</td>
                                        <td className="tableData">{manager.email}</td>
                                        <td className="tableData">{branch}</td>
                                        <td className="tableData actionStart">
                                            <input type="submit" value="Edit" onClick={this.editManager.bind(this, index, manager.id, name, phoneNumber, manager.email, branch)} />
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
                        editOptions={editOptions}
                        editErrors={this.state.editErrors}
                        saveHandler={this.saveEdits.bind(this)}
                        closeHandler={this.closeEditor.bind(this)}
                        topPosition={this.state.editPosition + "px"} />
                </CSSTransition>
            </div>
        );
    }
}