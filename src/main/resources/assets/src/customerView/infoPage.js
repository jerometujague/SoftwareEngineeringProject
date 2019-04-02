import React from 'react';
import $ from 'jquery';
import { fixTime } from '../functions';

export default class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            emailConsent: false,
            errors: {}
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    handleChecked(event) {
        const target = event.target;
        const value = target.checked;
        const name = target.name;

        this.setState({
            [name]: value,
        })
    }

    validateInput(email, firstName, lastName, phoneNumber) {
        let formIsValid = true;
        let errors = {};

        if (email == '') {
            formIsValid = false;
            errors["email"] = "Please enter your email address.";
        }

        if (firstName == '') {
            formIsValid = false;
            errors["firstName"] = "Please enter your first name.";
        }

        if (lastName == '') {
            formIsValid = false;
            errors["lastName"] = "Please enter your last name.";
        }

        if (phoneNumber == '') {
            formIsValid = false;
            errors["phoneNumber"] = "Please enter your phoneNumber.";
        }

        //checks for valid email address
        if (email !== "undefined") {
            //regular expression for email validation
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(email)) {
                formIsValid = false;
                errors["email"] = "Please enter valid email address.";
            }
        }

        //checks for valid phone number
        if (phoneNumber !== "undefined") {
            if (!phoneNumber.match(/^[0-9]{10}$/)) {
                formIsValid = false;
                errors["phoneNumber"] = "Please enter valid phone number.";
            }
        }

        this.setState({
            errors: errors
        });
        return formIsValid;
    }

    async scheduleAppointment() {
        //validate user input
        if (!this.validateInput(this.state.email, this.state.firstName, this.state.lastName, this.state.phoneNumber)) {
            return;
        }

        // Show a loading image
        this.props.setStateValue('loading', true);

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
                calendarId: this.props.appointmentSlot.calendarId,
                time: fixTime(this.props.appointmentSlot.time),
                branchId: this.props.branchId,
                customerId: customerId,
                serviceIds: this.props.serviceIds,
                note: this.props.note,
                emailConsent: this.state.emailConsent
            })
        });

        // Get the appointment that was just scheduled
        let url = "/api/appointments";

        await $.getJSON(url, (appointmentList) => {
            this.props.setStateValue('appointment', appointmentList[appointmentList.length - 1]);
        });

        this.props.setStateValue('customerName', this.state.firstName + " " + this.state.lastName);

        // Stop loading and move to next page
        this.props.setStateValue('loading', false);
        this.props.goForward();
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

    render() {
        return (
            <div className="page">
                <h2 className="pageHeader">Now we just need a few more details.</h2>
                <form>
                    <label>
                        First Name
                    <input type="text" name="firstName" onChange={this.handleChange.bind(this)} />
                        <div className="error">{this.state.errors.firstName}</div>
                    </label>
                    <label>
                        Last Name
                    <input type="text" name="lastName" onChange={this.handleChange.bind(this)} />
                        <div className="error">{this.state.errors.lastName}</div>
                    </label>
                    <br />
                    <label>
                        Email
                    <input type="email" name="email" onChange={this.handleChange.bind(this)} />
                        <div className="error">{this.state.errors.email}</div>
                    </label>
                    <label>
                        Phone Number
                    <input type="tel" name="phoneNumber" onChange={this.handleChange.bind(this)} />
                        <div className="error">{this.state.errors.phoneNumber}</div>
                    </label>
                    <label>
                        Email consent
                    <input type="checkbox" name="emailConsent" checked={this.state.emailConsent} onChange={this.handleChecked.bind(this)} />
                    </label>
                </form>

                <input type="submit" value="Schedule Appointment" id="scheduleButton" onClick={this.scheduleAppointment.bind(this)} />
            </div>
        );
    }
}