import React from 'react';
import $ from 'jquery';
import { fixTime } from './functions';

export default class Info extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
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

    async scheduleAppointment() {
        // TODO: Valid email checking here
        if (this.state.firstName == '' || this.state.lastName == '' || this.state.email == '') {
            // TODO: Show a error message
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
                serviceIds: this.props.serviceIds
            })
        });

        // Show the completion page
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
                <h2>Now we just need a few more details.</h2>
                <form>
                    <label>
                        First Name
                    <input type="text" name="firstName" onChange={this.handleChange.bind(this)} />
                    </label>
                    <label>
                        Last Name
                    <input type="text" name="lastName" onChange={this.handleChange.bind(this)} />
                    </label>
                    <br />
                    <label>
                        Email
                    <input type="email" name="email" onChange={this.handleChange.bind(this)} />
                    </label>
                    <label>
                        Phone number
                    <input type="tel" name="phoneNumber" onChange={this.handleChange.bind(this)} />
                    </label>
                </form>

                <input type="submit" value="Schedule Appointment" id="scheduleButton" onClick={this.scheduleAppointment.bind(this)} />
            </div>
        );
    }
}