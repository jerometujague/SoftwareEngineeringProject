import 'babel-polyfill';
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './css/base.css';
import './css/manager.css';
import loadingImage from './images/loading.gif';

class ManagerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }

    async loadAppointments() {
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
    }

    render() {
        return (
            <div>
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