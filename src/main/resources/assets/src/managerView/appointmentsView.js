import $ from 'jquery';
import React from 'react';
import { convertTime24to12, getTopResults, convertTime12to24 } from '../functions';
import EditDialog from './editDialog';
import { CSSTransition } from 'react-transition-group';
import HeaderFilters from './headerFilters';

export default class AppointmentsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            customers: [],
            branches: [],
            services: [],
            managers: [],
            filters: [[], [], [], [], []],
            masterSearchFilter: "",
            editAppointment: { time: "", branch: "", manager: "", customer: "", services: "" },
            showEditDialog: false,
            editErrors: [],
            editPosition: 0,
        }

        this.headerNames = ["Time", "Branch", "Manager", "Customer", "Service"];
        this.dataNeeded = ["customers", "branches", "services", "managers", "appointments"];

        this.loadData();
    }

    async loadData() {
        this.props.setStateValue('loading', true);

        await this.dataNeeded.forEach(async data => {
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
        })

        this.props.setStateValue('loading', false);
    }

    clearFilters() {
        this.setState({
            filters: [[], [], [], [], []],
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

        await this.loadAppointments();

        this.props.setStateValue('loading', false);
    }

    editAppointment(index, id, time, branchName, managerName, customerName, serviceString) {
        const appointment = {
            id: id,
            time: time,
            branch: branchName,
            manager: managerName,
            customer: customerName,
            services: serviceString,
        }

        this.setState({
            editAppointment: appointment,
            showEditDialog: true,
            editErrors: [],
            editPosition: index * 35 + 125,
        })
    }

    closeEditor() {
        this.setState({
            showEditDialog: false,
        })
    }

    async saveEdits(itemId, newValues) {
        this.props.setStateValue('loading', true);

        const time = convertTime12to24(newValues[0]);
        const branch = this.state.branches.find(b => b.name == newValues[1]);
        const manager = this.state.managers.find(m => m.firstName + " " + m.lastName == newValues[2]);
        const customer = this.state.customers.find(c => c.firstName + " " + c.lastName == newValues[3]);

        const newServices = newValues[4].split(', ');

        let validServices = true;
        const serviceIds = newServices.map(s => {
            const found = this.state.services.find(service => service.service == s)
            if (found) {
                return found.id;
            } else {
                validServices = false;
            }
        });

        const validTime = time.match('^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$');

        // Check if the data is valid
        if (!branch || !manager || !customer || !validTime || !validServices) {
            const newEditErrors = this.state.editErrors;

            if (!validTime) {
                newEditErrors[0] = "Invalid time";
            }

            if (!branch) {
                newEditErrors[1] = "Invalid branch name";
            }

            if (!manager) {
                newEditErrors[2] = "Invalid manager name";
            }

            if (!customer) {
                newEditErrors[3] = "Invalid customer name";
            }

            if (!validServices) {
                newEditErrors[4] = "Invalid services";
            }

            this.setState({
                editErrors: newEditErrors,
            })

            this.props.setStateValue('loading', false);
            return;
        }

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
                calendarId: 1,
                time: time,
                branchId: branchId,
                managerId: managerId,
                customerId: customerId,
                serviceIds: serviceIds
            })
        });

        this.setState({
            showEditDialog: false,
        })

        await this.loadAppointments();

        this.props.setStateValue('loading', false);
    }

    getBranchName(id) {
        return this.state.branches.find(b => { return b.id == id }).name;
    }

    getCustomerName(id) {
        const customer = this.state.customers.find(c => { return c.id == id });
        return customer.firstName + " " + customer.lastName;
    }

    getManagerName(id) {
        const manager = this.state.managers.find(m => { return m.id == id });
        return manager.firstName + " " + manager.lastName;
    }

    getServiceName(id) {
        return this.state.services.find(s => { return s.id == id }).service;
    }

    render() {
        const previewOptions = [
            getTopResults(this.state.appointments.map(a => a.time[0])).map(r => convertTime24to12(r.item)),
            getTopResults(this.state.appointments.map(a => a.branchId)).map(r => this.getBranchName(r.item)),
            getTopResults(this.state.appointments.map(a => a.managerId)).map(r => this.getManagerName(r.item)),
            getTopResults(this.state.appointments.map(a => a.customerId)).map(r => this.getCustomerName(r.item)),
            getTopResults(this.state.appointments.map(a => a.serviceIds).flat()).map(r => this.getServiceName(r.item))];

        const editOptions = [
            getTopResults(this.state.appointments.map(a => a.time[0])).map(r => convertTime24to12(r.item)),
            getTopResults(this.state.branches.map(a => a.id)).map(r => this.getBranchName(r.item)),
            getTopResults(this.state.managers.map(a => a.id)).map(r => this.getManagerName(r.item)),
            getTopResults(this.state.customers.map(a => a.id)).map(r => this.getCustomerName(r.item)),
            getTopResults(this.state.services.map(a => a.id).flat()).map(r => this.getServiceName(r.item))
        ];

        return (
            <div className="mainViewHolder">
                <h2 className="viewHeader">Appointments</h2>
                <input type="text" placeholder="Find an appointment..." className="masterSearchInput" onChange={this.masterSearchInput.bind(this)} />
                {
                    // Show a clear all link if there is a filter
                    (this.state.filters[0].length > 0 ||
                        this.state.filters[1].length > 0 ||
                        this.state.filters[2].length > 0 ||
                        this.state.filters[3].length > 0 ||
                        this.state.filters[4].length > 0) &&
                    <a onClick={this.clearFilters.bind(this)}>Clear all current filters</a>
                }

                <table>
                    <thead>
                        <tr>
                            <HeaderFilters
                                headerNames={this.headerNames}
                                previewOptions={previewOptions}
                                filters={this.state.filters}
                                setFilters={this.setFilters.bind(this)} />
                            <td colSpan="2"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.appointments.map((appointment, index) => {
                                const customerName = this.getCustomerName(appointment.customerId)
                                const managerName = this.getManagerName(appointment.managerId);
                                const branchName = this.getBranchName(appointment.branchId);

                                const time = convertTime24to12(appointment.time[0]);

                                const serviceNames = [];

                                let serviceString = "";
                                for (let i = 0; i < appointment.serviceIds.length; i++) {
                                    if (i < appointment.serviceIds.length - 1)
                                        serviceString += this.state.services[appointment.serviceIds[i] - 1].service + ", ";
                                    else
                                        serviceString += this.state.services[appointment.serviceIds[i] - 1].service;
                                    serviceNames.push(this.state.services[appointment.serviceIds[i] - 1].service);
                                }

                                // Check for filtering
                                if ((this.state.filters[0].length > 0 && !this.state.filters[0].includes(time)) ||
                                    (this.state.filters[1].length > 0 && !this.state.filters[1].includes(branchName)) ||
                                    (this.state.filters[2].length > 0 && !this.state.filters[2].includes(managerName)) ||
                                    (this.state.filters[3].length > 0 && !this.state.filters[3].includes(customerName)) ||
                                    (this.state.filters[4].length > 0 && !this.state.filters[4].some(s => serviceNames.indexOf(s) >= 0))) {
                                    return;
                                }

                                // Check for master search filtering
                                if (this.state.masterSearchFilter.length > 0 &&
                                    !time.toLowerCase().match(this.state.masterSearchFilter.toLowerCase()) &&
                                    !branchName.toLowerCase().match(this.state.masterSearchFilter.toLowerCase()) &&
                                    !managerName.toLowerCase().match(this.state.masterSearchFilter.toLowerCase()) &&
                                    !customerName.toLowerCase().match(this.state.masterSearchFilter.toLowerCase()) &&
                                    !serviceString.toLowerCase().match(this.state.masterSearchFilter.toLowerCase())) {
                                    return;
                                }

                                return (
                                    <tr key={appointment.id} className="appointment">
                                        <td className="appointmentData">{time}</td>
                                        <td className="appointmentData">{branchName}</td>
                                        <td className="appointmentData">{managerName}</td>
                                        <td className="appointmentData">{customerName}</td>
                                        <td className="appointmentData">{serviceString}</td>
                                        <td className="appointmentData actionStart">
                                            <input type="submit" value="Edit" onClick={this.editAppointment.bind(this, index, appointment.id, time, branchName, managerName, customerName, serviceString)} />
                                        </td>
                                        <td className="appointmentData">
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
                        editId={this.state.editAppointment.id}
                        editItems={[this.state.editAppointment.time,
                        this.state.editAppointment.branch,
                        this.state.editAppointment.manager,
                        this.state.editAppointment.customer,
                        this.state.editAppointment.services]}
                        editOptions={editOptions}
                        editErrors={this.state.editErrors}
                        saveHandler={this.saveEdits.bind(this)}
                        closeHandler={this.closeEditor.bind(this)}
                        topPosition={this.state.editPosition + "px"} />
                </CSSTransition>
            </div>
        )
    }
}