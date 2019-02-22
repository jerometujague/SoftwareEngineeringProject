

class CustomerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            services: [],
            appointmentSlots: [],
        }

        this.loadServices();
    }

    loadServices(){
        let url = "/api/services";

        $.getJSON(url, (servicesList) => {
            const newServices = [];
            servicesList.forEach(service => {
                newServices.push(service);
            });

            this.setState({
                services: newServices,
            });
        });
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
                {
                    this.state.services.map(service => {
                        return <button key={service.id}>{service.service}</button>
                    })
                }
            </div>

            
            <input type="submit" value="Schedule Appointment" id="scheduleButton" onClick={this.scheduleAppointment.bind(this)}/>
        </div>);
    }
}

ReactDOM.render(
    <CustomerView/>,
    document.getElementById('root')
);