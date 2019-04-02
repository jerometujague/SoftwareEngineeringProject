import $ from 'jquery';
import React from 'react';

export default class AppointmentsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
        }

        this.loadAppointments();
    }

    async loadAppointments() {
        this.props.setStateValue('loading', true);

        let url = "/api/appointments";

        await $.getJSON(url, (appointmentsList) => {
            const newAppointments = [];
            appointmentsList.forEach(appointment => {
                newAppointments.push(appointment);
            });

            this.setState({
                appointments: newAppointments,
            });
        });

        this.props.setStateValue('loading', false);
    }

    render() {
        return (
            <div className="mainViewHolder">
                <h3>Appointments</h3>
                {
                    this.state.appointments.map(appointment => {
                        return (
                            <div key={appointment.id} className="appointment">
                                <span className="appointmentData">{appointment.id}</span>
                                <span className="appointmentData">{appointment.time}</span>
                                <span className="appointmentData">{appointment.branchId}</span>
                                <span className="appointmentData">{appointment.managerId}</span>
                                <span className="appointmentData">{appointment.customerId}</span>
                                <span className="appointmentData">{appointment.serviceIds}</span>
                                <span className="appointmentData">{appointment.note}</span>
                            </div>
                        );
                    })
                }
            </div>
        )
    }
}