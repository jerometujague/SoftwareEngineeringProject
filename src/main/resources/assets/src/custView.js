import 'babel-polyfill';
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import AppointmentSlots from './appointmentSlotsPage';
import Branches from './branchesPage';
import './css/customer.css';
import './css/progressBar.css';
import Details from './detailsPage';
import loadingImage from './images/loading.gif';
import Info from './infoPage';
import Services from './servicesPage';

class CustomerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            branches: [],
            services: [],
            appointmentSlots: [],
            serviceIds: [],
            branchId: 0,
            appointmentSlot: null,
            appointment: null,
            customerName: "",
            page: 0,
            loading: false,
            wentBack: false,
        }
    }

    componentDidMount() {
        this.loadServices();
    }

    async loadServices() {
        this.setState({
            loading: true,
        });

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

        this.setState({
            loading: false,
        });

        this.goForward();
    }

    goBack() {
        // Go back one page if back button is clicked
        this.setState({
            page: this.state.page - 1,
            wentBack: true,
        });
    }

    goForward() {
        this.setState({
            page: this.state.page + 1,
            wentBack: false,
        });
    }

    setStateValue(name, value) {
        this.setState({
            [name]: value,
        });
    }

    render() {
        return (<div>
            <div id="header">
                {this.state.page >= 2 && this.state.page <= 4 && // Show the back button when page is 2 or greater
                    <div id="backButtonHolder">
                        <button id="backButton" onClick={this.goBack.bind(this)}>Go Back</button>
                    </div>
                }
                <h1 id="headerText">Schedule an appointment</h1>
            </div>

            <div id="progressBar">
                <ul className="progressbar">
                    <li className={this.state.page >= 1 ? "active" : ""}></li>
                    <li className={this.state.page >= 2 ? "active" : ""}></li>
                    <li className={this.state.page >= 3 ? "active" : ""}></li>
                    <li className={this.state.page >= 4 ? "active" : ""}></li>
                    <li className={this.state.page >= 5 ? "active" : ""}></li>
                </ul>
            </div>

            <CSSTransition // Services page that shows the services and loads the branches
                in={this.state.page == 1}
                timeout={600}
                classNames={this.state.wentBack ? "pageBack" : "page"}
                unmountOnExit>
                <Services
                    services={this.state.services}
                    serviceIds={this.state.serviceIds}
                    goForward={this.goForward.bind(this)}
                    setStateValue={this.setStateValue.bind(this)} />
            </CSSTransition>

            <CSSTransition // Branches page that shows the branches and loads the appointment slots
                in={this.state.page == 2}
                timeout={600}
                classNames={this.state.wentBack ? "pageBack" : "page"}
                unmountOnExit>
                <Branches
                    branches={this.state.branches}
                    serviceIds={this.state.serviceIds}
                    goForward={this.goForward.bind(this)}
                    setStateValue={this.setStateValue.bind(this)} />
            </CSSTransition>

            <CSSTransition // AppointmentSlots page that shows the appointment slots and moves to info page
                in={this.state.page == 3}
                timeout={600}
                classNames={this.state.wentBack ? "pageBack" : "page"}
                unmountOnExit>
                <AppointmentSlots
                    appointmentSlots={this.state.appointmentSlots}
                    goForward={this.goForward.bind(this)}
                    setStateValue={this.setStateValue.bind(this)} />
            </CSSTransition>

            <CSSTransition // Info page that lets the customer enter information and schedules appointment
                in={this.state.page == 4}
                timeout={600}
                classNames={this.state.wentBack ? "pageBack" : "page"}
                unmountOnExit>
                <Info
                    appointmentSlot={this.state.appointmentSlot}
                    branchId={this.state.branchId}
                    serviceIds={this.state.serviceIds}
                    goForward={this.goForward.bind(this)}
                    setStateValue={this.setStateValue.bind(this)} />
            </CSSTransition>

            <CSSTransition // Details page that shows appointment details and lets the customer cancel appointment
                in={this.state.page == 5}
                timeout={600}
                classNames={this.state.wentBack ? "pageBack" : "page"}
                unmountOnExit>
                <Details
                    appointment={this.state.appointment}
                    appointmentSlot={this.state.appointmentSlot}
                    branches={this.state.branches}
                    services={this.state.services}
                    customerName={this.state.customerName} />
            </CSSTransition>

            <CSSTransition // Loading image for when we are retrieving data
                in={this.state.loading}
                timeout={{
                    enter: 300,
                    exit: 0,
                }}
                classNames="loading"
                unmountOnExit>
                <div id="loadingDiv">
                    <img id="loadingImage" src={loadingImage} />
                </div>
            </CSSTransition>
        </div>);
    }
}

ReactDOM.render(
    <CustomerView />,
    document.getElementById('root')
);