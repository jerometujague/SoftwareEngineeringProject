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
                                            getTopResults(this.state.appointments.map(a => a.time[0])).map((time, index) => {
                                                if (index < numPreviewFilters) {
                                                    return <div key={index} className="filterItem">{convertTime24to12(time.item)}</div>;
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
                                                    return (
                                                        <div key={index} className="filterItem">
                                                            {
                                                                this.state.branches.find(b => { return b.id == branch.item }).name
                                                            }
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

                                                    return <div key={index} className="filterItem">{managerName}</div>;
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

                                                    return <div key={index} className="filterItem">{customerName}</div>;
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

                                                    return <div key={index} className="filterItem">{service}</div>;
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

                                const time = convertTime24to12(appointment.time.slice(0, appointment.time.length - 1));

                                let serviceString = "";
                                for (let i = 0; i < appointment.serviceIds.length; i++) {
                                    if (i < appointment.serviceIds.length - 1)
                                        serviceString += this.state.services[appointment.serviceIds[i] - 1].service + ", ";
                                    else
                                        serviceString += this.state.services[appointment.serviceIds[i] - 1].service;
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