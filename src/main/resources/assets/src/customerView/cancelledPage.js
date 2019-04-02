import React from 'react';

export default class Cancelled extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page">
                <h2 className="pageHeader">{"Your appointment has been cancelled"}</h2>
                <p>You have cancelled your appointment</p>
                <input type="submit" value="Schedule Appointment" onClick={this.props.goToBeginning} />
            </div>
        );
    }
}
