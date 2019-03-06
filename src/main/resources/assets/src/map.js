import React from 'react';

export class Map extends React.Component {
    constructor(props) {
        super(props);

        this.mapRef = React.createRef();
    }

    async getCurrentLocation() {
        let origin;

        const getCurrentPosition = () => new Promise(resolve => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    origin = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    resolve(origin);
                });
            }
        });

        return await getCurrentPosition();
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

        const map = new google.maps.Map(this.mapRef.current, { zoom: 13, center: await this.getCurrentLocation(), disableDefaultUI: true });

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
    let origin = "Warrensburg, MO";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            origin = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
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
    const response = await getDistanceMatrix(service, {
        origins: [origin],
        destinations: [address],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL,
    });

    return response.rows[0].elements[0].distance.text;
}