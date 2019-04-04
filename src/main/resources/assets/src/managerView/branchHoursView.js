import React from 'react';
import $ from 'jquery';

export default class BranchHoursView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            branchHours: [],
        }

        this.loadHours();
    }

    async loadHours(){
        this.props.setStateValue('loading', true);

        let url = "/api/branchHours";

        await $.getJSON(url, (branchHoursList) => {
            const newBranchHours = [];
            branchHoursList.forEach(branch => {
                newBranchHours.push(branch);
            });

            this.setState({
                branchHours: newBranchHours,
            });
        });
        this.props.setStateValue('loading', false);
    }

    render() {
        return (
            <div className="mainViewHolder">
                <h3>Branch Hours</h3>
                {
                    this.state.branchHours.map(branchHour => {
                        return (
                            <div key={branchHour.id} className="branchHours">
                                <span className="branchHoursData">{branchHour.id}</span>
                                <span className="branchHoursData">{branchHour.openTime}</span>
                                <span className="branchHoursData">{branchHour.closeTime}</span>
                                <span className="branchHoursData">{branchHour.branchId}</span>
                                <span className="branchHoursData">{branchHour.dayOfWeek}</span>
                            </div>
                        );
                    })
                }

            </div>
        );
    }
}