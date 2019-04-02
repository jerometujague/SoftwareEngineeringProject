import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './css/base.css';
import './css/manager.css';
import loadingImage from './images/loading.gif';
import AppointmentsView from './managerView/appointmentsView';

class ManagerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    setStateValue(name, value) {
        this.setState({
            [name]: value,
        });
    }

    render() {
        return (
            <div>
                <div id="sideBar">
                    <div className="sideBarItem">Appointments</div>
                    <div className="sideBarItem">Managers</div>
                    <div className="sideBarItem">Manager Scheduling</div>
                    <div className="sideBarItem">Branch Scheduling</div>
                    <div className="sideBarItem">Branch Hours</div>
                </div>

                <AppointmentsView
                    setStateValue={this.setStateValue.bind(this)} />

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
            </div>
        )
    }
}

ReactDOM.render(
    <ManagerView />,
    document.getElementById('root')
);