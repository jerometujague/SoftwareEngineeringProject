import React from 'react';
import blueDotImage from '../images/blueDot.png';

export class Map extends React.Component {
    constructor(props) {
        super(props);

        this.mapRef = React.createRef();
    }

    async componentDidMount() {
        await this.loadMap();
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
        const map = new google.maps.Map(this.mapRef.current, { disableDefaultUI: true });

        // Create a marker at the current location
        new google.maps.Marker({
            position: currentLocation,
            map: map,
            icon: blueDotImage,
        });

        // Establish the bounds based on the markers and current location
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(currentLocation);

        // Create markers for each branch
        for (const branch of this.props.branches) {
            const address = branch.streetAddress + ", " + branch.city + ", " + branch.state + " " + branch.zipCode;
            const geocoder = new google.maps.Geocoder();

            // Wait for the geocoder to resolve
            await new Promise(resolve => {
                geocoder.geocode({ 'address': address }, results => {
                    const location = results[0].geometry.location;
                    new google.maps.Marker({ position: location, map: map, title: branch.name, label: { text: branch.name, color: '#3366ff' } });
                    bounds.extend(location);
                    resolve();
                });
            });
        }

        // Fit the map to the bounds
        map.fitBounds(bounds, 20);
    }

    render() {
        return (<div ref={this.mapRef} id="map"></div>);
    }
}

export async function distance(address) {
    let origin = await getCurrentLocation();

    if (origin == null) {
        return null;
    }

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
            }, () => {
                resolve(null);
            });
        }
    });

    return await getCurrentPosition();
}