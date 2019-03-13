import React from 'react';

export default function Services(props) {
    function handleServiceClicked(id) {
        const ids = props.serviceIds;

        // Check if id is already in array
        var index = ids.indexOf(id);
        if (index !== -1) {
            ids.splice(index, 1);
        } else {
            ids.push(id);
        }

        props.setServiceIds(ids);
    }

    async function handleServicesDone() {
        // Load the branches and move the page forward
        await props.loadBranches();
        props.goForward();
    }

    return (
        <div className="page">
            <h2>What can we help you with?</h2>
            <p>Choose as many as you would like.</p>
            <div id="services">
                {
                    props.services.map(service => {
                        return <button key={service.id} className={props.serviceIds.includes(service.id) ? "selected" : ""} onClick={handleServiceClicked.bind(this, service.id)}>{service.service}</button>
                    })
                }
            </div>
            <input type="submit" value="Next" onClick={handleServicesDone.bind(this)} />
        </div>
    );
}