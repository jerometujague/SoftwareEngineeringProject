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

        let service = [];
        let serviceString = "";
        this.props.services.forEach(s => {
            if (this.props.appointment.serviceIds.includes(s.id)) {
                service.push(s.service);
            }
        });

        for(let i = 0; i<service.length; i++){
            if(i < service.length-1)
                serviceString += service[i] + ", ";
            else
                serviceString += service[i];
        }


        return (
            <div className="page">
                <h2>{"Here's your appointment:"}</h2>
                <p>{this.props.customerName},</p>
                <p>{"Your appointment is scheduled. We'll see you soon!"}</p>
                <p>{branch.streetAddress}</p>
                <p>{branch.city + ", " + branch.state + " " + branch.zipCode}</p>
                <p>{this.props.appointmentSlot.day}, {this.props.appointmentSlot.month} {this.props.appointmentSlot.date}</p>
                <p>{this.props.appointmentSlot.time}</p>
                <p>{serviceString}</p>
                <p>{this.props.appointment.note}</p>
            </div>
        );
    }
}