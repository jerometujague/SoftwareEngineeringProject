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
            filters: [[], [], [], [], []],
            itemFilterInput: "",
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

    render() {
        const headerNames = ["Time", "Branch", "Manager", "Customer", "Service"];
        const numPreviewFilters = 5;

        return (
            <div className="mainViewHolder">
                <h2 className="viewHeader">Appointments</h2>
                {
                    (this.state.filters[0].length > 0 ||
                        this.state.filters[1].length > 0 ||
                        this.state.filters[2].length > 0 ||
                        this.state.filters[3].length > 0 ||
                        this.state.filters[4].length > 0) &&
                    <a onClick={this.clearFilters.bind(this)}>Clear current filters</a>
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
                                if ((this.state.filters[0].length > 0 && !this.state.filters[0].includes(time)) ||
                                    (this.state.filters[1].length > 0 && !this.state.filters[1].includes(branchName)) ||
                                    (this.state.filters[2].length > 0 && !this.state.filters[2].includes(managerName)) ||
                                    (this.state.filters[3].length > 0 && !this.state.filters[3].includes(customerName)) ||
                                    (this.state.filters[4].length > 0 && !this.state.filters[4].some(s => serviceNames.indexOf(s) >= 0))) {
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