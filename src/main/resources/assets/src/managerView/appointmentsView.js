import $ from 'jquery';
import React from 'react';
import { convertTime24to12, getTopResults } from '../functions';

export default class AppointmentsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            customers: [],
            branches: [],
            services: [],
            managers: [],
            timeFilters: [],
            branchFilters: [],
            managerFilters: [],
            customerFilters: [],
            serviceFilters: [],
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
        this.loadCustomers();
        this.loadBranches();
        this.loadServices();
        this.loadManagers();
        this.loadAppointments();
        this.props.setStateValue('loading', false);

        document.addEventListener('click', this.handleOutsideClick.bind(this), false);
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
        }

        if (!this.branchFilter.current.contains(event.target)) {
            this.branchFilter.current.open = false;
        }

        if (!this.managerFilter.current.contains(event.target)) {
            this.managerFilter.current.open = false;
        }

        if (!this.customerFilter.current.contains(event.target)) {
            this.customerFilter.current.open = false;
        }

        if (!this.serviceFilter.current.contains(event.target)) {
            this.serviceFilter.current.open = false;
        }
    }

    addTimeFilter(time) {
        const filters = this.state.timeFilters;

        const index = filters.indexOf(time);
        if (index == -1) {
            filters.push(time);
        } else {
            filters.splice(index, 1);
        }

        this.setState({
            timeFilters: filters,
        })

        this.timeFilter.current.open = false;
    }

    addBranchFilter(branch) {
        const filters = this.state.branchFilters;

        const index = filters.indexOf(branch);
        if (index == -1) {
            filters.push(branch);
        } else {
            filters.splice(index, 1);
        }

        this.setState({
            branchFilters: filters,
        })

        this.branchFilter.current.open = false;
    }

    addManagerFilter(manager) {
        const filters = this.state.managerFilters;

        const index = filters.indexOf(manager);
        if (index == -1) {
            filters.push(manager);
        } else {
            filters.splice(index, 1);
        }

        this.setState({
            managerFilters: filters,
        })

        this.managerFilter.current.open = false;
    }

    addCustomerFilter(customer) {
        const filters = this.state.customerFilters;

        const index = filters.indexOf(customer);
        if (index == -1) {
            filters.push(customer);
        } else {
            filters.splice(index, 1);
        }

        this.setState({
            customerFilters: filters,
        })

        this.customerFilter.current.open = false;
    }

    addServiceFilter(service) {
        const filters = this.state.serviceFilters;

        const index = filters.indexOf(service);
        if (index == -1) {
            filters.push(service);
        } else {
            filters.splice(index, 1);
        }

        this.setState({
            serviceFilters: filters,
        })

        this.serviceFilter.current.open = false;
    }

    render() {
        const numPreviewFilters = 5;

        return (
            <div className="mainViewHolder">
                <h2 className="viewHeader">Appointments</h2>
                <table>
                    <thead>
                        <tr>
                            <td>
                                <details ref={this.timeFilter}>
                                    <summary className="filterHeader">Time</summary>
                                    <details-menu class="filterMenu">
                                        <input type="text" placeholder="Filter time" className="filterInput" />
                                        {
                                            getTopResults(this.state.appointments.map(a => a.time[0])).map((t, index) => {
                                                if (index < numPreviewFilters) {
                                                    const time = convertTime24to12(t.item);
                                                    return (
                                                        <div key={index} className="filterItem" onClick={this.addTimeFilter.bind(this, time)}>
                                                            {
                                                                this.state.timeFilters.includes(time) &&
                                                                <svg className="filterCheckmark" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                                            }
                                                            <p className="filterItemText">{time}</p>
                                                        </div>);
                                                }
                                            })
                                        }
                                    </details-menu>
                                </details>
                            </td>
                            <td>
                                <details ref={this.branchFilter}>
                                    <summary className="filterHeader">Branch</summary>
                                    <details-menu class="filterMenu">
                                        <input type="text" placeholder="Filter branch" className="filterInput" />
                                        {
                                            getTopResults(this.state.appointments.map(a => a.branchId)).map((branch, index) => {
                                                if (index < numPreviewFilters) {
                                                    const branchName = this.state.branches.find(b => { return b.id == branch.item }).name;
                                                    return (
                                                        <div key={index} className="filterItem" onClick={this.addBranchFilter.bind(this, branchName)}>
                                                            {
                                                                this.state.branchFilters.includes(branchName) &&
                                                                <svg className="filterCheckmark" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                                            }
                                                            <p className="filterItemText">{branchName}</p>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                    </details-menu>
                                </details>
                            </td>
                            <td>
                                <details ref={this.managerFilter}>
                                    <summary className="filterHeader">Manager</summary>
                                    <details-menu class="filterMenu">
                                        <input type="text" placeholder="Filter manager" className="filterInput" />
                                        {
                                            getTopResults(this.state.appointments.map(a => a.managerId)).map((man, index) => {
                                                if (index < numPreviewFilters) {
                                                    const manager = this.state.managers.find(m => { return m.id == man.item });
                                                    const managerName = manager.firstName + " " + manager.lastName;

                                                    return (
                                                        <div key={index} className="filterItem" onClick={this.addManagerFilter.bind(this, managerName)}>
                                                            {
                                                                this.state.managerFilters.includes(managerName) &&
                                                                <svg className="filterCheckmark" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                                            }
                                                            <p className="filterItemText">{managerName}</p>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                    </details-menu>
                                </details>
                            </td>
                            <td>
                                <details ref={this.customerFilter}>
                                    <summary className="filterHeader">Customer</summary>
                                    <details-menu class="filterMenu">
                                        <input type="text" placeholder="Filter customer" className="filterInput" />
                                        {
                                            getTopResults(this.state.appointments.map(a => a.customerId)).map((cust, index) => {
                                                if (index < numPreviewFilters) {
                                                    const customer = this.state.customers.find(c => { return c.id == cust.item });
                                                    const customerName = customer.firstName + " " + customer.lastName;

                                                    return (
                                                        <div key={index} className="filterItem" onClick={this.addCustomerFilter.bind(this, customerName)}>
                                                            {
                                                                this.state.customerFilters.includes(customerName) &&
                                                                <svg className="filterCheckmark" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                                            }
                                                            <p className="filterItemText">{customerName}</p>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                    </details-menu>
                                </details>
                            </td>
                            <td>
                                <details ref={this.serviceFilter}>
                                    <summary className="filterHeader">Service</summary>
                                    <details-menu class="filterMenu">
                                        <input type="text" placeholder="Filter services" className="filterInput" />
                                        {
                                            getTopResults(this.state.appointments.map(a => a.serviceIds).flat()).map((serviceId, index) => {
                                                if (index < numPreviewFilters) {
                                                    const service = this.state.services.find(s => { return s.id == serviceId.item }).service;

                                                    return (
                                                        <div key={index} className="filterItem" onClick={this.addServiceFilter.bind(this, service)}>
                                                            {
                                                                this.state.serviceFilters.includes(service) &&
                                                                <svg className="filterCheckmark" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                                            }
                                                            <p className="filterItemText">{service}</p>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                    </details-menu>
                                </details>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.appointments.map(appointment => {
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
                                if ((this.state.timeFilters.length > 0 && !this.state.timeFilters.includes(time)) ||
                                    (this.state.branchFilters.length > 0 && !this.state.branchFilters.includes(branchName)) ||
                                    (this.state.managerFilters.length > 0 && !this.state.managerFilters.includes(managerName)) ||
                                    (this.state.customerFilters.length > 0 && !this.state.customerFilters.includes(customerName)) ||
                                    (this.state.serviceFilters.length > 0 && !this.state.serviceFilters.some(s => serviceNames.indexOf(s) >= 0))) {
                                    return;
                                }

                                return (
                                    <tr key={appointment.id} className="appointment">
                                        <td className="appointmentData">{time}</td>
                                        <td className="appointmentData">{branchName}</td>
                                        <td className="appointmentData">{managerName}</td>
                                        <td className="appointmentData">{customerName}</td>
                                        <td className="appointmentData">{serviceString}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}