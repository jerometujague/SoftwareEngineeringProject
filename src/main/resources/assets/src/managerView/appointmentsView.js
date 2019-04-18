import $ from 'jquery';
import React from 'react';
import { convertTime24to12, getTopResults, convertTime12to24 } from '../functions';
import { EditDialog, EditorData, EditItem } from './editDialog';
import { CSSTransition } from 'react-transition-group';
import HeaderFilters from './headerFilters';

Array.prototype.flat = function () { return this.reduce((acc, val) => acc.concat(val), []); }

export default class AppointmentsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: [[], [], [], [], [], []],
            masterSearchFilter: "",
            showEditDialog: false,
            editorData: undefined,
        }

        this.headerNames = ["Date", "Time", "Branch", "Manager", "Customer", "Service"];
    }

    clearFilters() {
        this.setState({
            filters: [[], [], [], [], [], []],
        })
    }

    setFilters(newFilters) {
        this.setState({
            filters: newFilters,
        })
    }

    masterSearchInput(e) {
        this.setState({
            masterSearchFilter: e.target.value,
        })
    }

    async cancelAppointment(id) {
        this.props.setStateValue('loading', true);

        // Send the delete request
        await $.ajax({
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/appointments/delete/' + id + '/'
        });

        await this.props.loadData('appointments');
        this.props.setStateValue('loading', false);
    }

    editAppointment(index, id, ...items) {
        items.pop();
        this.setState({
            showEditDialog: true,
            editorData: new EditorData(id, items, [], index * 35 + 125),
        })
    }

    closeEditor() {
        this.setState({
            showEditDialog: false,
        })
    }

    async saveEdits(itemId, newValues) {
        this.props.setStateValue('loading', true);

        const dateArray = newValues[0].split('-');
        const date = this.props.calendar.find(c => c.date[0] == '20' + dateArray[2] && c.date[1] == dateArray[0] && c.date[2] == dateArray[1]);
        const time = convertTime12to24(newValues[1]);
        const branch = this.props.branches.find(b => b.name == newValues[2]);
        const manager = this.props.managers.find(m => m.firstName + " " + m.lastName == newValues[3]);
        const customer = this.props.customers.find(c => c.firstName + " " + c.lastName == newValues[4]);

        const newServices = newValues[5].split(', ');

        let validServices = true;
        const serviceIds = newServices.map(s => {
            const found = this.props.services.find(service => service.service == s)
            if (found) {
                return found.id;
            } else {
                validServices = false;
            }
        });

        // Check if the data is valid
        if (!branch || !manager || !customer || !time || !validServices || !date) {
            const newEditorData = this.state.editorData;

            if (!date) {
                newEditorData.editErrors[0] = "Invalid date";
            }

            if (!time) {
                newEditorData.editErrors[1] = "Invalid time";
            }

            if (!branch) {
                newEditorData.editErrors[2] = "Invalid branch name";
            }

            if (!manager) {
                newEditorData.editErrors[3] = "Invalid manager name";
            }

            if (!customer) {
                newEditorData.editErrors[4] = "Invalid customer name";
            }

            if (!validServices) {
                newEditorData.editErrors[5] = "Invalid services";
            }

            this.setState({
                editorData: newEditorData,
            })

            this.props.setStateValue('loading', false);
            return;
        }

        const calendarId = date.calendarId;
        const branchId = branch.id;
        const managerId = manager.id;
        const customerId = customer.id;

        await $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/appointments/update',
            data: JSON.stringify({
                id: itemId,
                calendarId: calendarId,
                time: time,
                branchId: branchId,
                managerId: managerId,
                customerId: customerId,
                serviceIds: serviceIds,
                note: this.props.appointments.find(a => a.id == itemId).note
            })
        });

        await this.props.loadData('appointments');
        this.props.setStateValue('loading', false);

        this.setState({
            showEditDialog: false,
        })
    }

    getBranchName(id) {
        return this.props.branches.find(b => { return b.id == id }).name;
    }

    getCustomerName(id) {
        const customer = this.props.customers.find(c => { return c.id == id });
        return customer.firstName + " " + customer.lastName;
    }

    getManagerName(id) {
        const manager = this.props.managers.find(m => { return m.id == id });
        return manager.firstName + " " + manager.lastName;
    }

    getServiceName(id) {
        return this.props.services.find(s => { return s.id == id }).service;
    }

    getDate(id) {
        const date = this.props.calendar.find(c => { return c.calendarId == id }).date;
        return date[1] + "-" + date[2] + "-" + String(date[0]).slice(2);
    }

    render() {
        const filterOptions = [
            getTopResults(this.props.appointments.map(a => a.calendarId)).map(r => this.getDate(r.item)),
            getTopResults(this.props.appointments.map(a => a.time[0])).map(r => convertTime24to12(r.item)),
            getTopResults(this.props.appointments.map(a => a.branchId)).map(r => this.getBranchName(r.item)),
            getTopResults(this.props.appointments.map(a => a.managerId)).map(r => this.getManagerName(r.item)),
            getTopResults(this.props.appointments.map(a => a.customerId)).map(r => this.getCustomerName(r.item)),
            getTopResults(this.props.appointments.map(a => a.serviceIds).flat()).map(r => this.getServiceName(r.item))];

        const editOptions = [
            filterOptions[0],
            filterOptions[1],
            getTopResults(this.props.branches.map(a => a.id)).map(r => this.getBranchName(r.item)),
            getTopResults(this.props.managers.map(a => a.id)).map(r => this.getManagerName(r.item)),
            getTopResults(this.props.customers.map(a => a.id)).map(r => this.getCustomerName(r.item)),
            getTopResults(this.props.services.map(a => a.id).flat()).map(r => this.getServiceName(r.item))
        ];

        return (
            <div className="mainViewHolder" >
                <h2 className="viewHeader">Appointments</h2>
                <input type="text" placeholder="Find an appointment..." className="masterSearchInput" onChange={this.masterSearchInput.bind(this)} />
                {
                    // Show a clear all link if there is a filter
                    (this.state.filters[0].length > 0 ||
                        this.state.filters[1].length > 0 ||
                        this.state.filters[2].length > 0 ||
                        this.state.filters[3].length > 0 ||
                        this.state.filters[4].length > 0 ||
                        this.state.filters[5].length > 0) &&
                    <a onClick={this.clearFilters.bind(this)}>Clear all current filters</a>
                }

                <table>
                    <thead>
                        <tr>
                            <HeaderFilters
                                headerNames={this.headerNames}
                                filterOptions={filterOptions}
                                filters={this.state.filters}
                                setFilters={this.setFilters.bind(this)} />
                            <td colSpan="2"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.appointments.map((appointment, index) => {
                                const tableData = [];
                                tableData.push(new EditItem("Date", this.getDate(appointment.calendarId), editOptions[0]));
                                tableData.push(new EditItem("Time", convertTime24to12(appointment.time[0]), editOptions[1]));
                                tableData.push(new EditItem("Branch", this.getBranchName(appointment.branchId), editOptions[2]));
                                tableData.push(new EditItem("Manager", this.getManagerName(appointment.managerId), editOptions[3]));
                                tableData.push(new EditItem("Customer", this.getCustomerName(appointment.customerId), editOptions[4]));

                                const serviceNames = [];

                                let serviceString = "";
                                for (let i = 0; i < appointment.serviceIds.length; i++) {
                                    if (i < appointment.serviceIds.length - 1)
                                        serviceString += this.props.services[appointment.serviceIds[i] - 1].service + ", ";
                                    else
                                        serviceString += this.props.services[appointment.serviceIds[i] - 1].service;
                                    serviceNames.push(this.props.services[appointment.serviceIds[i] - 1].service);
                                }

                                tableData.push(new EditItem("Services", serviceString, editOptions[5], true));

                                // Check for filtering
                                for (let i = 0; i < tableData.length - 1; i++) {
                                    if (this.state.filters[i].length > 0 && !this.state.filters[i].includes(tableData[i].value)) {
                                        return;
                                    }
                                }

                                // Special check for services
                                if ((this.state.filters[5].length > 0 && !this.state.filters[5].some(s => serviceNames.indexOf(s) >= 0))) {
                                    return;
                                }

                                let match = false;
                                // Check for master search filtering
                                tableData.forEach(data => {
                                    if (data.value.toLowerCase().match(this.state.masterSearchFilter.toLowerCase())) {
                                        match = true;
                                    }
                                });

                                if (!match && this.state.masterSearchFilter.length > 0) {
                                    return
                                }

                                return (
                                    <tr key={appointment.id}>
                                        {
                                            tableData.map((data, index) => {
                                                return <td key={index} className="tableData">{data.value}</td>;
                                            })
                                        }
                                        <td className="tableData actionStart">
                                            <input type="submit" value="Edit" onClick={this.editAppointment.bind(this, index, appointment.id, ...tableData)} />
                                        </td>
                                        <td className="tableData">
                                            <input type="submit" value="Cancel" onClick={this.cancelAppointment.bind(this, appointment.id)} />
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
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
            </div >
        )
    }
}