import React from 'react';
import $ from 'jquery';
import { distance } from './map';

export default class Services extends React.Component {
    constructor(props) {
        super(props);
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
        // Load the branches and move the page forward
        this.loadBranches();
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
                            return <button key={service.id} className={this.props.serviceIds.includes(service.id) ? "selected" : ""} onClick={this.handleServiceClicked.bind(this, service.id)}>{service.service}</button>
                        })
                    }
                </div>
                <input type="submit" value="Next" onClick={this.handleServicesDone.bind(this)} />
            </div>
        );
    }
}