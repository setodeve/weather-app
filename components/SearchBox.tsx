import React, { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Input } from '@yamada-ui/react'

const styles = {
  center: {
    margin: '0 auto',
  },
}

interface SearchBoxProps {
  placeholder?: string
  onPlacesChanged?: (places: google.maps.places.PlaceResult[]) => void
}

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
  libraries: ['places'],
  id: 'googleMapID',
})

const SearchBox: React.FC<SearchBoxProps> = ({ placeholder, onPlacesChanged }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null)

  useEffect(() => {
    loader
      .load()
      .then(() => {
        if (!inputRef.current) {
          console.error('Input reference is not available.');
          return;
        }
        const searchBox = new google.maps.places.SearchBox(inputRef.current)
        searchBoxRef.current = searchBox

        const handlePlacesChanged = () => {
          if (onPlacesChanged) {
            onPlacesChanged(searchBox.getPlaces() || [])
          }
        }

        searchBox.addListener('places_changed', handlePlacesChanged)

        return () => {
          google.maps.event.clearInstanceListeners(searchBox)
        }
      })
      .catch((e) => {
        console.error('Error loading Google Maps API:', e)
      })
  }, [onPlacesChanged])

  return (
    <Input style={styles.center} width='50%' ref={inputRef} placeholder={placeholder} type='text' />
  )
}

export default SearchBox
