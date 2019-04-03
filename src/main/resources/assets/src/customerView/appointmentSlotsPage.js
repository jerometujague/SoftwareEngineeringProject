import React from 'react';
import $ from 'jquery';

export default class AppointmentSlots extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fullAppointmentSlots: [],
        }
    }

    handleAppointmentSlotClicked(slot) {
        this.props.setStateValue('appointmentSlot', slot);
        this.props.goForward();
    }

    async handleDateChanged(e) {
        const newDate = e.target.value;

        if (this.props.appointmentSlots.length > 1) {
            this.setState({
                fullAppointmentSlots: this.props.appointmentSlots,
            });
        }

        if (newDate == "") {
            this.props.setStateValue('appointmentSlots', this.state.fullAppointmentSlots);
            return;
        }

        this.props.setStateValue('loading', true);

        await $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: "/api/appointment-slots/" + this.props.branchId + "/" + newDate,
            data: JSON.stringify(this.props.serviceIds),
            success: (appointmentSlotsList) => {
                const newAppointmentSlots = [];
                newAppointmentSlots.push(appointmentSlotsList);
                this.props.setStateValue('appointmentSlots', newAppointmentSlots);
            }
        });

        this.props.setStateValue('loading', false);
    }

    render() {
        return (
            <div className="page" id="appointmentSlots">
                <h2 className="pageHeader">{"Let's find a time that works for you."}</h2>
                <input type="date" onChange={this.handleDateChanged.bind(this)} />
                <div id="slotHolder">
                    {
                        this.props.appointmentSlots[0].length > 0
                            ?
                            this.props.appointmentSlots.map((slot, i) => {
                                return (
                                    <div key={i}>
                                        <h3>{slot[0].day + ", " + slot[0].month + " " + slot[0].date}</h3>
                                        <div className="timeSlots">
                                            {
                                                slot.map((time, j) => {
                                                    return (
                                                        <div key={j}>
                                                            <input className="appointmentTime" type="submit" value={time.time} disabled={time.taken} onClick={this.handleAppointmentSlotClicked.bind(this, time)} />
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                );
                            })
                            :
                            <p>No appointments available</p>
                    }
                </div>
            </div>
        );
    }
}