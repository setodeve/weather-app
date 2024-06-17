import GoogleMapReact from 'google-map-react'
import React from 'react'

interface WeatherMapProps {
  lat: number
  lng: number
}

const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lng }) => {
  const defaultLatLng = {
    lat: lat,
    lng: lng,
  }

  const renderMarkers = (map: any, maps: any) => {
    new maps.Marker({
      position: defaultLatLng,
      map,
    })
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '' }}
        defaultCenter={defaultLatLng}
        defaultZoom={8}
        onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
        yesIWantToUseGoogleMapApiInternals
      />
    </div>
  )
}

export default WeatherMap
