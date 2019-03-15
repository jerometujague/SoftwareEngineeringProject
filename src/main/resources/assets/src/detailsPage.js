import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { icons } from './servicesPage';

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

        for (let i = 0; i < service.length; i++) {
            if (i < service.length - 1)
                serviceString += service[i] + ", ";
            else
                serviceString += service[i];
        }


        return (
            <div className="page">
                <h2>{"Here's your appointment:"}</h2>
                <p>{this.props.customerName},</p>
                <p>{"Your appointment is scheduled. We'll see you soon!"}</p>

                <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" fixedWidth className="detailsIcon" id="mapIcon" />
                <div className="detailsData">
                    <p>{branch.streetAddress}</p>
                    <p>{branch.city + ", " + branch.state + " " + branch.zipCode}</p>
                </div>
                <FontAwesomeIcon icon={faCalendarAlt} size="2x" fixedWidth className="detailsIcon" />
                <div className="detailsData">
                    <p>{this.props.appointmentSlot.day}, {this.props.appointmentSlot.month} {this.props.appointmentSlot.date}</p>
                    <p>{this.props.appointmentSlot.time}</p>
                </div>
                <FontAwesomeIcon icon={icons[this.props.appointment.serviceIds[0] - 1]} size="2x" fixedWidth className="detailsIcon" />
                <div className="detailsData">
                    <p>{serviceString}</p>
                    <p>{this.props.appointment.note}</p>
                </div>
            </div>
        );
    }
}