import React from 'react';

export default class AppointmentSlots extends React.Component {
    constructor(props) {
        super(props);
    }

    handleAppointmentSlotClicked(slot) {
        this.props.setStateValue('appointmentSlot', slot);
        this.props.goForward();
    }

    render() {
        return (
            <div className="page" id="appointmentSlots">
                <h2 className="pageHeader">{"Let's find a time that works for you."}</h2>
                <div id="slotHolder">
                    {
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
                    }
                </div>
            </div>
        );
    }
}