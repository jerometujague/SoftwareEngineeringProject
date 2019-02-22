

class CustomerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            services: [],
            appointmentSlots: [],
        }
    }

    loadData(){

    }

    scheduleAppointment(){
        // Send the schedule request
        $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            url: '/api/appointments/add',
            data: JSON.stringify({
                calendarId: 60,
                time: "12:00",
                branchId: 1,
                managerId: 1,
                customerId: 1,
                serviceId: 1
            })
        });
    }

    render(){
        return (<div>
            <h1>What can we help you with?</h1>
            <p>Choose as many topics as you need.</p>

            <div>
                <button>Checking Account</button>
                <button>Savings Account</button>
                <button>CDs/Money Market Accounts</button>
                <button>Student Banking</button>
                <button>Auto Loans</button>
                <button>Home Equity</button>
                <button>Mortgage</button>
                <button>Student Loans</button>
                <button>Saving for Retirement</button>
                <button>Investment Account</button>
                <button>Credit Card</button>
                <button>Other</button>
            </div>

            
            <input type="submit" value="Schedule Appointment" id="scheduleButton" onClick={this.scheduleAppointment.bind(this)}/>
        </div>);
    }
}

ReactDOM.render(
    <CustomerView/>,
    document.getElementById('root')
);