import React from 'react';
import $ from 'jquery';
import { distance } from './map';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faPiggyBank, faGraduationCap, faHome, faCar, faCreditCard, faBookReader, faCommentAlt } from "@fortawesome/free-solid-svg-icons";

// Icons that correspond to position in the services grid
export const icons = [faMoneyBill, faPiggyBank, faMoneyBill,
    faBookReader, faCar, faHome,
    faHome, faGraduationCap, faMoneyBill,
    faMoneyBill, faCreditCard, faCommentAlt];

export default class Services extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            note: ''
        }
    }

    handleServiceClicked(id) {
        const ids = this.props.serviceIds;

        // Check if id is already in array
        var index = ids.indexOf(id);
        if (index !== -1) {
            ids.splice(index, 1);
        } else {
            ids.push(id);
        }

        this.props.setStateValue('serviceIds', ids);
    }

    handleServicesDone() {
        // Check if at least on service is selected
        if (this.props.serviceIds.length == 0) {
            return;
        }

        this.props.setStateValue('note', this.state.note);
        // Load the branches
        this.loadBranches();
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    loadBranches() {
        this.props.setStateValue('loading', true);

        $.ajax({
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: '/api/branches',
            data: JSON.stringify(this.props.serviceIds),
            success: (data) => this.loadBranchesWithDistance(data)
        });
    }

    async loadBranchesWithDistance(branchesList) {
        const newBranches = [];

        for (const branch of branchesList) {
            // Get distance to branch from here
            branch.distance = await distance(branch.streetAddress + ", " + branch.city + ", " + branch.state + " " + branch.zipCode);
            newBranches.push(branch);
        }

        newBranches.sort((a, b) => {
            if (a.hasService && !b.hasService) {
                return -1;
            } else if (!a.hasService && b.hasService) {
                return 1;
            } else {
                if (a.distance < b.distance) {
                    return -1;
                } else if (a.distance > b.distance) {
                    return 1;
                } else {
                    return 0;
                }
            }
        })

        this.props.setStateValue('branches', newBranches);
        this.props.setStateValue('loading', false);
        this.props.goForward();
    }

    render() {
        return (
            <div className="page" >
                <h2>What can we help you with?</h2>
                <p>Choose as many as you would like.</p>
                <div id="services">
                    {
                        this.props.services.map(service => {
                            return (<button
                                key={service.id}
                                className={this.props.serviceIds.includes(service.id) ? "service selected" : "service"}
                                onClick={this.handleServiceClicked.bind(this, service.id)}>
                                <FontAwesomeIcon icon={icons[service.id - 1]} size="2x" fixedWidth className="serviceIcon" />
                                {service.service}
                            </button>);
                        })
                    }
                </div>
                <div>
                    <br />
                    <label>
                        Appointment Note
                    </label><br />
                    <textarea className="note" rows="5" cols="50" placeholder="Enter an appointment note" name="note" onChange={this.handleChange.bind(this)} ></textarea>
                </div>
                <input type="submit" value="Continue" disabled={this.props.serviceIds.length == 0} onClick={this.handleServicesDone.bind(this)} />
            </div>
        );
    }
}