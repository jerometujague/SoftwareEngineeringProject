function fixTime(oldTime){
    // Get AM or PM
    let t = oldTime.slice(-2);

    // Cut off AM or PM
    let time = oldTime.slice(0, oldTime.length - 2);

    // Add 12 to hour if PM
    if(t == "PM"){
        let array = time.split(":");
        if(array[0] != 12){
            let newHour = Number(array[0]) + 12;
            time = newHour + ":00";
        }
    }

    let array = time.split(":");

    // Check if hour is single digit
    if(array[0] < 10){
        time = "0" + array[0] + ":00";
    }

    return time;
}

class CustomerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            services: [],
            appointmentSlots: [],
            serviceId: 0,
            branchId: 0,
            appointmentSlot: null,
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

    loadAppointmentSlots(branchId, serviceId){
        let url = "/api/appointment-slots/" + branchId + "/" + serviceId;

        $.getJSON(url, (appointmentSlotsList) => {
            const newAppointmentSlots = [];
            appointmentSlotsList.forEach(appointmentSlot => {
                newAppointmentSlots.push(appointmentSlot);
            });

            this.setState({
                appointmentSlots: newAppointmentSlots,
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
                calendarId: this.state.appointmentSlot.calendarId,
                time: fixTime(this.state.appointmentSlot.time),
                branchId: this.state.branchId,
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

    handleBranchClicked(id){
        this.setState({
            branchId: id,
        });

        this.loadAppointmentSlots(id, this.state.serviceId);
    }

    handleAppointmentSlotClicked(slot){
        this.setState({
            appointmentSlot: slot,
        });
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
                                <input type="submit" value="Choose branch" disabled={!branch.hasService} onClick={this.handleBranchClicked.bind(this, branch.id)}/>
                            </div>
                        );
                    })
                }
            </div>
            <div id="appointmentSlots">
                {
                    this.state.appointmentSlots.map((slot, i) => {
                        return <input key={i} type="submit" value={slot.day + " " + slot.month + " " + slot.date + " at " + slot.time} disabled={slot.taken} onClick={this.handleAppointmentSlotClicked.bind(this, slot)}/>
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