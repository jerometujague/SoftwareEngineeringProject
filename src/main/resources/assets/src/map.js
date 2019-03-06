import React from 'react';
import blueDotImage from './images/blueDot.png';

export class Map extends React.Component {
    constructor(props) {
        super(props);

        this.mapRef = React.createRef();
    }

    componentDidMount() {
        this.loadMap();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.branches != this.props.branches) {
            this.loadMap();
        }
    }

    async loadMap() {
        const google = window.google;

        // Get the current location
        const currentLocation = await getCurrentLocation();

        // Create the map centered on the current location
        const map = new google.maps.Map(this.mapRef.current, { zoom: 13, center: currentLocation, disableDefaultUI: true });

        // Create a marker at the current location
        new google.maps.Marker({
            position: currentLocation,
            map: map,
            icon: blueDotImage,
        });

        // Create markers for each branch
        this.props.branches.forEach(branch => {
            const address = branch.streetAddress + ", " + branch.city + ", " + branch.state + " " + branch.zipCode;
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, results => {
                new google.maps.Marker({ position: results[0].geometry.location, map: map });
            });
        });
    }

    render() {
        return (<div ref={this.mapRef} id="map"></div>);
    }
}

export async function distance(address) {
    let origin = await getCurrentLocation();

    const getDistanceMatrix = (service, data) => new Promise((resolve, reject) => {
        service.getDistanceMatrix(data, (response, status) => {
            if (status === 'OK') {
                resolve(response)
            } else {
                reject(response);
            }
        })
    });

    const google = window.google;

    const service = new google.maps.DistanceMatrixService();

    // Get the driving distance in miles
    const response = await getDistanceMatrix(service, {
        origins: [origin],
        destinations: [address],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL,
    });

    return response.rows[0].elements[0].distance.text;
}

async function getCurrentLocation() {
    const getCurrentPosition = () => new Promise(resolve => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const origin = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                resolve(origin);
            });
        }
    });

    return await getCurrentPosition();
}