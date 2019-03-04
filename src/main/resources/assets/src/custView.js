import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { CSSTransition } from 'react-transition-group';
import 'babel-polyfill';
import './css/customer.css';
import loadingImage from './images/loading.gif';

function fixTime(oldTime) {
    // Get AM or PM
    let t = oldTime.slice(-2);

    // Cut off AM or PM
    let time = oldTime.slice(0, oldTime.length - 2);

    // Add 12 to hour if PM
    if (t == "PM") {
        let array = time.split(":");
        if (array[0] != 12) {
            let newHour = Number(array[0]) + 12;
            time = newHour + ":00";
        }
    }

    let array = time.split(":");

    // Check if hour is single digit
    if (array[0] < 10) {
        time = "0" + array[0] + ":00";
    }

    return time;
}

class CustomerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            services: [],
            appointmentSlots: [],
            serviceId: 0,
            branchId: 0,
            appointmentSlot: null,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            page: 1,
            loading: false,
            wentBack: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.loadServices();
        this.goBack = this.goBack.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async addCustomer() {
        let url = "/api/customers/" + this.state.email + "/";
        let id = 0;

        // Check if the customer already exists
        await $.getJSON(url, (customer) => {
            if (customer.id > 0) {
                // Customer already exists, schedule appointment with that id
                id = customer.id;
            }
        });

        if (id == 0) {
            // Create a new customer
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/customers/add',
                data: JSON.stringify({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    phoneNumber: this.state.phoneNumber,
                    email: this.state.email
                })
            });

            // Get the id of the customer just created
            await $.getJSON(url, (customer) => {
                // Call schedule appointment with the new id
                id = customer.id;
            });
        }

        return id;
    }

    async loadServices() {
        let url = "/api/services";

        await $.getJSON(url, (servicesList) => {
            const newServices = [];
            servicesList.forEach(service => {
                newServices.push(service);
            });

            this.setState({
                services: newServices,
            });
        });
    }

    async loadBranches(id) {
        let url = "/api/branches/" + id;

        await $.getJSON(url, (branchesList) => {
            const newBranches = [];
            branchesList.forEach(branch => {
                newBranches.push(branch);
            });

            this.setState({
                branches: newBranches,
            });
        });
    }

    async loadAppointmentSlots(branchId, serviceId) {
        let url = "/api/appointment-slots/" + branchId + "/" + serviceId;

        await $.getJSON(url, (appointmentSlotsList) => {
            const newAppointmentSlots = [];
            let daySlots = [];
            let lastDay = appointmentSlotsList[0].day;
            appointmentSlotsList.forEach(appointmentSlot => {
                if (appointmentSlot.day != lastDay) {
                    // Hit a new day
                    newAppointmentSlots.push(daySlots);
                    daySlots = [];
                }

                daySlots.push(appointmentSlot);

                lastDay = appointmentSlot.day;
            });

            newAppointmentSlots.push(daySlots);

            this.setState({
                appointmentSlots: newAppointmentSlots,
            });
        });
    }

    async scheduleAppointment() {
        // TODO: Valid email checking here
        if (this.state.firstName == '' || this.state.lastName == '' || this.state.email == '') {
            // TODO: Show a error message
            return;
        }

        // Show a loading image
        this.setState({
            loading: true,
        });

        let customerId = await this.addCustomer();

        // Send the schedule request
        await $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/appointments/add',
            data: JSON.stringify({
                calendarId: this.state.appointmentSlot.calendarId,
                time: fixTime(this.state.appointmentSlot.time),
                branchId: this.state.branchId,
                customerId: customerId,
                serviceId: this.state.serviceId
            })
        });

        // Show the completion page
        this.setState({
            page: 5,
            loading: false,
            wentBack: false,
        });
    }

    async handleServiceClicked(id) {
        // Update service id and show a loading image
        this.setState({
            serviceId: id,
            loading: true,
        });

        // Load the branches based on this service
        await this.loadBranches(id);

        this.setState({
            page: 2,
            loading: false,
            wentBack: false,
        });
    }

    async handleBranchClicked(id) {
        // Update branch id and show a loading image
        this.setState({
            branchId: id,
            loading: true,
        });

        // Load the appointment slots based on the branch and service
        await this.loadAppointmentSlots(id, this.state.serviceId);

        this.setState({
            page: 3,
            loading: false,
            wentBack: false,
        });
    }

    handleAppointmentSlotClicked(slot) {
        this.setState({
            appointmentSlot: slot,
            page: 4,
            wentBack: false,
        });
    }

    async goBack() {
        //Go back one page if back button is clicked
        this.setState({
            page: this.state.page - 1,
            wentBack: true,
        });
    }

    render() {
        return (<div>
            <div id="header">
                {this.state.page >= 2 && // Show the back button when page is 2 or greater
                    <div id="backButtonHolder">
                        <button id="backButton" onClick={this.goBack}>Go Back</button>
                    </div>
                }
                <h1 id="headerText">Schedule an appointment</h1>
            </div>

            <CSSTransition
                in={this.state.page == 1}
                timeout={600}
                classNames={this.state.wentBack ? "pageBack" : "page"}
                unmountOnExit>
                <div className="page">
                    <h2>What can we help you with?</h2>
                    <h2>Choose a service</h2>
                    <div id="services">
                        {
                            this.state.services.map(service => {
                                return <button key={service.id} onClick={this.handleServiceClicked.bind(this, service.id)}>{service.service}</button>
                            })
                        }
                    </div>
                </div>
            </CSSTransition>

            <CSSTransition
                in={this.state.page == 2}
                timeout={600}
                classNames={this.state.wentBack ? "pageBack" : "page"}
                unmountOnExit>
                <div className="page" id="branches">
                    <h2>Choose a branch</h2>
                    {
                        this.state.branches.map(branch => {
                            return (
                                <div className="branch" key={branch.id}>
                                    <p>Name: {branch.name} </p>
                                    <input type="submit" value="Choose branch" disabled={!branch.hasService} onClick={this.handleBranchClicked.bind(this, branch.id)} />
                                </div>
                            );
                        })
                    }
                </div>
            </CSSTransition>

            <CSSTransition
                in={this.state.page == 3}
                timeout={600}
                classNames={this.state.wentBack ? "pageBack" : "page"}
                unmountOnExit>
                <div className="page" id="appointmentSlots">
                    <h2>Choose an appointment time</h2>
                    <div id="slotHolder">
                    {
                        this.state.appointmentSlots.map((slot, i) => {
                            return (
                                <div key={i}>
                                    <h3>{slot[0].day + ", " + slot[0].month + " " + slot[0].date}</h3>
                                    <div className="timeSlots">
                                        {
                                            slot.map((time, j) => {
                                                return (
                                                    <div key={j}>
                                                        <input className="appointmentTime" type="submit" value={time.time} disabled={time.taken} onClick={this.handleAppointmentSlotClicked.bind(this, slot)} />
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            );
                        })
                    }
                    </div>
                </div>
            </CSSTransition>

            <CSSTransition
                in={this.state.page == 4}
                timeout={600}
                classNames={this.state.wentBack ? "pageBack" : "page"}
                unmountOnExit>
                <div className="page">
                    <h2>Please enter your information.</h2>
                    <form>
                        <label>
                            First Name
                    <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
                        </label>
                        <br />
                        <label>
                            Last Name
                    <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
                        </label>
                        <br />
                        <label>
                            Email
                    <input type="email" name="email" value={this.state.email} onChange={this.handleChange} />
                        </label>
                    </form>

                    <input type="submit" value="Schedule Appointment" id="scheduleButton" onClick={this.scheduleAppointment.bind(this)} />
                </div>
            </CSSTransition>

            {this.state.page == 5 && // Show the confimation screen when page is 5
                <div>
                    <p>You have successfully scheduled an appointment</p>
                </div>
            }

            <CSSTransition
                in={this.state.loading}
                timeout={{
                    enter: 300,
                    exit: 0,
                }}
                classNames="loading"
                unmountOnExit>
                <div id="loadingDiv">
                    <img id="loadingImage" src={loadingImage} />
                </div>
            </CSSTransition>
        </div>);
    }
}

ReactDOM.render(
    <CustomerView />,
    document.getElementById('root')
);