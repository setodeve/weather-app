import GoogleMapReact from 'google-map-react';
import React from 'react';

interface LatLngEvent {
  x: number;
  y: number;
  lat: number;
  lng: number;
  event: Event;
}

export default function Create() {
  const defaultLatLng = {
    lat: 35.7022589,
    lng: 139.7744733,
  };

  const APIKEY = ""
  
  const setLatLng = ({ x, y, lat, lng, event }: LatLngEvent): void => {
    console.log(lat);
    console.log(lng);
  };

  return (
    <div style={{width: '100%', height: '400px'}}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: APIKEY }}
        defaultCenter={defaultLatLng}
        defaultZoom={8}
        onClick={setLatLng}
      >
      </GoogleMapReact>
    </div>
  );
}