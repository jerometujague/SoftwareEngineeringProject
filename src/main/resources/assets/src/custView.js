

class CustomerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            services: [],
            appointmentSlots: [],
            serviceId: 0,
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

    loadBranches(id){
        let url = "/api/branches/" + id;

        $.getJSON(url, (branchesList) => {
            const newBranches = [];
            branchesList.forEach(branch => {
                newBranches.push(branch);
            });

            this.setState({
                branches: newBranches,
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
                serviceId: this.state.serviceId
            })
        });
    }

    handleServiceClicked(id){
        this.setState({
            serviceId: id,
        });

        // Load the branches based on this service
        this.loadBranches(id);
    }

    render(){
        return (<div>
            <h1>What can we help you with?</h1>
            <p>Choose as many topics as you need.</p>

            <div id="services">
                {
                    this.state.services.map(service => {
                        return <button key={service.id} onClick={this.handleServiceClicked.bind(this, service.id)}>{service.service}</button>
                    })
                }
            </div>
            <div id="branches">
                {
                    this.state.branches.map(branch => {
                        return (
                            <div className="branch" key={branch.id}>
                                <p>Name: {branch.name} </p>
                                <input type="submit" value="Choose branch" disabled={!branch.hasService}/>
                            </div>
                        );
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