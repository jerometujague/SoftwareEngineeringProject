import $ from 'jquery';
import React from 'react';
import { convertTime24to12, getTopResults, convertTime12to24 } from '../functions';
import EditDialog from './editDialog';
import { CSSTransition } from 'react-transition-group';

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
            itemFilterInput: "",
            masterSearchFilter: "",
            editAppointment: { time: "", branch: "", manager: "", customer: "", services: "" },
            showEditDialog: false,
            editErrors: [],
            editPosition: 0,
        }

        this.timeFilter = React.createRef();
        this.branchFilter = React.createRef();
        this.managerFilter = React.createRef();
        this.customerFilter = React.createRef();
        this.serviceFilter = React.createRef();
    }

    componentDidMount() {
        // Load all of the data
        this.props.setStateValue('loading', true);
        this.loadData();
        this.props.setStateValue('loading', false);

        document.addEventListener('click', this.handleOutsideClick.bind(this), false);
    }

    async loadData() {
        await this.loadCustomers();
        await this.loadBranches();
        await this.loadServices();
        await this.loadManagers();
        await this.loadAppointments();
    }

    async loadAppointments() {
        let url = "/api/appointments";

        await $.getJSON(url, appointmentsList => {
            const newAppointments = [];
            appointmentsList.forEach(appointment => {
                newAppointments.push(appointment);
            });

            this.setState({
                appointments: newAppointments,
            });
        });
    }

    async loadCustomers() {
        let url = "/api/customers";

        await $.getJSON(url, customersList => {
            const newCustomers = [];
            customersList.forEach(customer => {
                newCustomers.push(customer);
            });

            this.setState({
                customers: newCustomers,
            });
        });
    }

    async loadServices() {
        let url = "/api/services";

        await $.getJSON(url, servicesList => {
            const newServices = [];
            servicesList.forEach(service => {
                newServices.push(service);
            });

            this.setState({
                services: newServices,
            });
        });
    }

    async loadBranches() {
        let url = "/api/branches";

        await $.getJSON(url, branchesList => {
            const newBranches = [];
            branchesList.forEach(branch => {
                newBranches.push(branch);
            });

            this.setState({
                branches: newBranches,
            });
        });
    }

    async loadManagers() {
        let url = "/api/managers";

        await $.getJSON(url, managersList => {
            const newManagers = [];
            managersList.forEach(manager => {
                newManagers.push(manager);
            });

            this.setState({
                managers: newManagers,
            });
        });
    }

    handleOutsideClick(event) {
        if (!this.timeFilter.current.contains(event.target)) {
            this.timeFilter.current.open = false;
            this.timeFilter.current.getElementsByTagName('input')[0].value = "";
            this.clearFilterInput();
        }

        if (!this.branchFilter.current.contains(event.target)) {
            this.branchFilter.current.open = false;
            this.branchFilter.current.getElementsByTagName('input')[0].value = "";
            this.clearFilterInput();
        }

        if (!this.managerFilter.current.contains(event.target)) {
            this.managerFilter.current.open = false;
            this.managerFilter.current.getElementsByTagName('input')[0].value = "";
            this.clearFilterInput();
        }

        if (!this.customerFilter.current.contains(event.target)) {
            this.customerFilter.current.open = false;
            this.customerFilter.current.getElementsByTagName('input')[0].value = "";
            this.clearFilterInput();
        }

        if (!this.serviceFilter.current.contains(event.target)) {
            this.serviceFilter.current.open = false;
            this.serviceFilter.current.getElementsByTagName('input')[0].value = "";
            this.clearFilterInput();
        }
    }

    addFilter(newFilter, type) {
        const filters = this.state.filters;

        const index = filters[type].indexOf(newFilter);
        if (index == -1) {
            filters[type].push(newFilter);
        } else {
            filters[type].splice(index, 1);
        }

        this.setState({
            filters: filters,
        })

        this.timeFilter.current.open = false;
        this.branchFilter.current.open = false;
        this.managerFilter.current.open = false;
        this.customerFilter.current.open = false;
        this.serviceFilter.current.open = false;
    }

    clearFilters() {
        this.setState({
            filters: [[], [], [], [], []],
        })
    }

    itemFilterInput(e) {
        this.setState({
            itemFilterInput: e.target.value,
        })
    }

    clearFilterInput() {
        this.setState({
            itemFilterInput: "",
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

    render() {
        const headerNames = ["Time", "Branch", "Manager", "Customer", "Service"];
        const numPreviewFilters = 5;

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
                            {
                                headerNames.map((headerName, headerIndex) => {
                                    // Find the ref for this header
                                    const headerRef = headerIndex == 0 ? this.timeFilter
                                        : headerIndex == 1 ? this.branchFilter
                                            : headerIndex == 2 ? this.managerFilter
                                                : headerIndex == 3 ? this.customerFilter
                                                    : headerIndex == 4 ? this.serviceFilter : undefined;

                                    // Get the top results for the current filter
                                    const topResults = headerIndex == 0 ? getTopResults(this.state.appointments.map(a => a.time[0]))
                                        : headerIndex == 1 ? getTopResults(this.state.appointments.map(a => a.branchId))
                                            : headerIndex == 2 ? getTopResults(this.state.appointments.map(a => a.managerId))
                                                : headerIndex == 3 ? getTopResults(this.state.appointments.map(a => a.customerId))
                                                    : headerIndex == 4 ? getTopResults(this.state.appointments.map(a => a.serviceIds).flat()) : undefined;

                                    let counter = 0;

                                    return (
                                        <td key={headerIndex}>
                                            <details ref={headerRef}>
                                                <summary className="filterHeader">{headerName}</summary>
                                                <details-menu class="filterMenu">
                                                    <input type="text" placeholder={"Filter " + headerName.toLowerCase()} className="filterInput" onChange={this.itemFilterInput.bind(this)} />
                                                    {
                                                        topResults.map((result, index) => {
                                                            if (counter < numPreviewFilters) {
                                                                // Get the item name for the current filter
                                                                let name = headerIndex == 0 ? convertTime24to12(result.item)
                                                                    : headerIndex == 1 ? this.state.branches.find(b => { return b.id == result.item }).name
                                                                        : headerIndex == 4 ? this.state.services.find(s => { return s.id == result.item }).service : undefined;

                                                                if (headerIndex == 2) {
                                                                    const manager = this.state.managers.find(m => { return m.id == result.item });
                                                                    name = manager.firstName + " " + manager.lastName;
                                                                } else if (headerIndex == 3) {
                                                                    const customer = this.state.customers.find(c => { return c.id == result.item });
                                                                    name = customer.firstName + " " + customer.lastName;
                                                                }

                                                                // Filter by search input
                                                                if (this.state.itemFilterInput.length > 0 && !name.toLowerCase().match(this.state.itemFilterInput.toLowerCase())) {
                                                                    return;
                                                                }

                                                                counter++;

                                                                return (
                                                                    <div key={index} className="filterItem" onClick={this.addFilter.bind(this, name, headerIndex)}>
                                                                        {
                                                                            this.state.filters[headerIndex].includes(name) &&
                                                                            <svg className="filterCheckmark" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                                                        }
                                                                        <p className="filterItemText">{name}</p>
                                                                    </div>
                                                                );
                                                            }
                                                        })
                                                    }

                                                </details-menu>
                                            </details>
                                        </td>
                                    );
                                })
                            }
                            <td colSpan="2"></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.appointments.map((appointment, index) => {
                                const customer = this.state.customers.find(c => { return c.id == appointment.customerId });
                                const customerName = customer.firstName + " " + customer.lastName;
                                const manager = this.state.managers.find(m => { return m.id == appointment.managerId });
                                const managerName = manager.firstName + " " + manager.lastName;
                                const branchName = this.state.branches.find(b => { return b.id == appointment.branchId }).name;

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
                        editErrors={this.state.editErrors}
                        saveHandler={this.saveEdits.bind(this)}
                        closeHandler={this.closeEditor.bind(this)}
                        topPosition={this.state.editPosition + "px"} />
                </CSSTransition>
            </div>
        )
    }
}