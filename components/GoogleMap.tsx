import GoogleMapReact from 'google-map-react'
import React from 'react'
// import { Loader } from '@googlemaps/js-api-loader';

// const loader = new Loader({
//     apiKey: process.env['NEXT_PUBLIC_GOOGLE_MAP_API_KEY'] as any,
//     version: "weekly",
//     libraries: ["places"]
// });

// interface LatLngEvent {
//   x: number
//   y: number
//   lat: number
//   lng: number
//   event: Event
// }

export default function Map({ lat, lng }: { lat: number; lng: number }) {
  const defaultLatLng = {
    lat: lat,
    lng: lng,
  }

  // const setLatLng = ({ x, y, lat, lng, event }: LatLngEvent): void => {
  //   console.log(lat)
  //   console.log(lng)
  // }

  const renderMarkers = (map: any, maps: any) => {
    // loader.load().then((google)=>{
    //   new maps.Marker({
    //     position: {
    //       lat: 35.6895,
    //       lng: 139.6923
    //     },
    //     map
    // })
    new maps.Marker({
      position: defaultLatLng,
      map,
    })
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env['NEXT_PUBLIC_GOOGLE_MAP_API_KEY'] as any }}
        defaultCenter={defaultLatLng}
        defaultZoom={8}
        onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
        // onClick={setLatLng}
        yesIWantToUseGoogleMapApiInternals
      ></GoogleMapReact>
    </div>
  )
}
