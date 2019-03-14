import React from 'react';

export default class Details extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let branch = null;
        this.props.branches.forEach(b => {
            if (b.id == this.props.appointment.branchId) {
                branch = b;
            }
        });

        let services = "";
        this.props.services.forEach(s => {
            if (this.props.appointment.serviceIds.includes(s.id)) {
                services += s.service + " ";
            }
        });

        return (
            <div className="page">
                <h2>{"Here's your appointment:"}</h2>
                <p>{this.props.customerName},</p>
                <p>{"Your appointment is scheduled. We'll see you soon!"}</p>
                <p>{branch.streetAddress}</p>
                <p>{branch.city + ", " + branch.state + " " + branch.zipCode}</p>
                <p>{this.props.appointmentSlot.day}, {this.props.appointmentSlot.month} {this.props.appointmentSlot.date}</p>
                <p>{this.props.appointmentSlot.time}</p>
                <p>{services}</p>
            </div>
        );
    }
}