import $ from 'jquery';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { EditDialog, EditorData, EditItem } from './editDialog';
import { getTopResults } from '../functions';
import HeaderFilters from './headerFilters';

export default class ManagersView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditDialog: false,
            editorData: undefined,
            filters: [[], [], [], []],
        }
    }

    editManager(index, id, ...items) {
        items.pop();
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(id, items, [], index * 35 + 87),
        })
    }

    addManager(editItems) {
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(-1, editItems, [], this.props.managers.length * 35 + 93),
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

        // Load the new manager data
        await this.props.loadData('managers');
        this.props.setStateValue('loading', false);
    }

    async saveEdits(id, newValues) {
        this.props.setStateValue('loading', true);

        const names = newValues[0].split(' ');

        const firstName = names[0];
        const lastName = names[1];
        const phoneNumber = newValues[1].replace(/\(|\)|\s|-/g, '');
        const email = newValues[2];
        const branch = this.props.branches.find(b => b.name == newValues[3]);

        const validPhoneNumber = phoneNumber.length == 10;
        const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        const validEmail = pattern.test(email);

        if (!branch || !validPhoneNumber || !validEmail) {
            const newEditorData = this.state.editorData;

            if (!validPhoneNumber) {
                newEditorData.editErrors[1] = "Invalid phone number";
            }

            if (!validEmail) {
                newEditorData.editErrors[2] = "Invalid email";
            }

            if (!branch) {
                newEditorData.editErrors[3] = "Invalid branch";
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

        await this.props.loadData('managers');
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

    getBranchName(id) {
        return this.props.branches.find(b => { return b.id == id }).name;
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
        const filterOptions = [[], [], [], getTopResults(this.props.managers.map(m => m.branchId)).map(r => this.getBranchName(r.item))];

        const branchOptions = getTopResults(this.props.branches.map(b => b.id)).map(r => this.getBranchName(r.item));

        const newEditItems = [
            new EditItem('Manager', ''),
            new EditItem('Phone number', ''),
            new EditItem('Email', ''),
            new EditItem('Branch', '', branchOptions)];

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
                            this.props.managers.map((manager, index) => {
                                const tableData = [];
                                tableData.push(new EditItem('Name', manager.firstName + " " + manager.lastName));
                                tableData.push(new EditItem('Phone number', this.getPhoneNumber(manager.phoneNumber)));
                                tableData.push(new EditItem('Email', manager.email));
                                tableData.push(new EditItem('Branch', this.getBranchName(manager.branchId), branchOptions));

                                // Check for filtering
                                if (this.state.filters[3].length > 0 && !this.state.filters[3].includes(tableData[3].value)) {
                                    return;
                                }

                                return (
                                    <tr key={manager.id}>
                                        {
                                            tableData.map((data, index) => {
                                                return <td key={index} className="tableData">{data.value}</td>;
                                            })
                                        }
                                        <td className="tableData actionStart">
                                            <input type="submit" value="Edit" onClick={this.editManager.bind(this, index, manager.id, ...tableData)} />
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
                <input type="submit" value="Add new manager" className="newItemButton" onClick={this.addManager.bind(this, newEditItems)} />
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