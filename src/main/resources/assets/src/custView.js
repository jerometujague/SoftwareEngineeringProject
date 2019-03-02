function fixTime(oldTime) {
    // Get AM or PM
    let t = oldTime.slice(-2);

    // Cut off AM or PM
    let time = oldTime.slice(0, oldTime.length - 2);

    // Add 12 to hour if PM
    if (t == "PM") {
        let array = time.split(":");
        if (array[0] != 12) {
            let newHour = Number(array[0]) + 12;
            time = newHour + ":00";
        }
    }

    let array = time.split(":");

    // Check if hour is single digit
    if (array[0] < 10) {
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
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            page: 1,
            loading: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.loadServices();
        this.goBack = this.goBack.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async addCustomer() {
        let url = "/api/customers/" + this.state.email + "/";
        let id = 0;

        // Check if the customer already exists
        await $.getJSON(url, (customer) => {
            if (customer.id > 0) {
                // Customer already exists, schedule appointment with that id
                id = customer.id;
            }
        });

        if (id == 0) {
            // Create a new customer
            await $.ajax({
                type: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: '/api/customers/add',
                data: JSON.stringify({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    phoneNumber: this.state.phoneNumber,
                    email: this.state.email
                })
            });

            // Get the id of the customer just created
            await $.getJSON(url, (customer) => {
                // Call schedule appointment with the new id
                id = customer.id;
            });
        }

        return id;
    }

    async loadServices() {
        let url = "/api/services";

        await $.getJSON(url, (servicesList) => {
            const newServices = [];
            servicesList.forEach(service => {
                newServices.push(service);
            });

            this.setState({
                services: newServices,
            });
        });
    }

    async loadBranches(id) {
        let url = "/api/branches/" + id;

        await $.getJSON(url, (branchesList) => {
            const newBranches = [];
            branchesList.forEach(branch => {
                newBranches.push(branch);
            });

            this.setState({
                branches: newBranches,
            });
        });
    }

    async loadAppointmentSlots(branchId, serviceId) {
        let url = "/api/appointment-slots/" + branchId + "/" + serviceId;

        await $.getJSON(url, (appointmentSlotsList) => {
            const newAppointmentSlots = [];
            appointmentSlotsList.forEach(appointmentSlot => {
                newAppointmentSlots.push(appointmentSlot);
            });

            this.setState({
                appointmentSlots: newAppointmentSlots,
            });
        });
    }

    async scheduleAppointment() {
        // TODO: Valid email checking here
        if (this.state.firstName == '' || this.state.lastName == '' || this.state.email == '') {
            // TODO: Show a error message
            return;
        }

        // Show a loading image
        this.setState({
            loading: true,
        });

        let customerId = await this.addCustomer();

        // Send the schedule request
        await $.ajax({
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
                customerId: customerId,
                serviceId: this.state.serviceId
            })
        });

        // Show the completion page
        this.setState({
            page: 5,
            loading: false,
        });
    }

    async handleServiceClicked(id) {
        // Update service id and show a loading image
        this.setState({
            serviceId: id,
            loading: true,
        });

        // Load the branches based on this service
        await this.loadBranches(id);

        this.setState({
            page: 2,
            loading: false,
        });
    }

    async handleBranchClicked(id) {
        // Update branch id and show a loading image
        this.setState({
            branchId: id,
            loading: true,
        });

        // Load the appointment slots based on the branch and service
        await this.loadAppointmentSlots(id, this.state.serviceId);

        this.setState({
            page: 3,
            loading: false,
        });
    }

    handleAppointmentSlotClicked(slot) {
        this.setState({
            appointmentSlot: slot,
            page: 4,
        });
    }

    async goBack(){
        //Go back one page if back button is clicked
        this.setState({
            page: this.state.page-1,
        });
    }

    render() {
        return (<div>
            {this.state.page >= 2 && //Show the button when page is 2 or greater
            <div>
                <button onClick={this.goBack}>Go Back</button>
            </div>
            }
            {this.state.page == 1 && // Show the services when page is 1
                <div>
                    <h1>What can we help you with?</h1>
                    <h2>Choose a service</h2>
                    <div id="services">
                        {
                            this.state.services.map(service => {
                                return <button key={service.id} onClick={this.handleServiceClicked.bind(this, service.id)}>{service.service}</button>
                            })
                        }
                    </div>
                </div>
            }

            {this.state.page == 2 && // Show the branches when page is 2
                <div id="branches">
                    <h2>Choose a branch</h2>
                    {
                        this.state.branches.map(branch => {
                            return (
                                <div className="branch" key={branch.id}>
                                    <p>Name: {branch.name} </p>
                                    <input type="submit" value="Choose branch" disabled={!branch.hasService} onClick={this.handleBranchClicked.bind(this, branch.id)} />
                                </div>
                            );
                        })
                    }
                </div>
            }

            {this.state.page == 3 && // Show the appointment slots when page is 3
                <div id="appointmentSlots">
                    <h2>Choose an appointment time</h2>
                    {
                        this.state.appointmentSlots.map((slot, i) => {
                            return <input key={i} type="submit" value={slot.day + " " + slot.month + " " + slot.date + " at " + slot.time} disabled={slot.taken} onClick={this.handleAppointmentSlotClicked.bind(this, slot)} />
                        })
                    }
                </div>
            }

            {this.state.page == 4 && // Show the page to enter information when page is 4
                <div>
                    <h2>Please enter your information.</h2>
                    <form>
                        <label>
                            First Name
                    <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
                        </label>
                        <br />
                        <label>
                            Last Name
                    <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
                        </label>
                        <br />
                        <label>
                            Email
                    <input type="email" name="email" value={this.state.email} onChange={this.handleChange} />
                        </label>
                    </form>

                    <input type="submit" value="Schedule Appointment" id="scheduleButton" onClick={this.scheduleAppointment.bind(this)} />
                </div>
            }

            {this.state.page == 5 && // Show the confimation screen when page is 5
                <div>
                    <p>You have successfully scheduled an appointment</p>
                </div>
            }

            {this.state.loading && // Show the loading image when page is loading something
                <div>
                    <img id="loadingImage" src="./images/loading.gif" />
                </div>
            }
        </div>);
    }
}

ReactDOM.render(
    <CustomerView />,
    document.getElementById('root')
);