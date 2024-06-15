import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface Location {
  town: string
  koaza: string
  lat: number
  lng: number
}

interface Place {
  lat: GLfloat
  lng: GLfloat
}

const Home: React.FC = () => {
  const router = useRouter()
  const [city, setCity] = useState<string[] | null>(null)

  const findLocations = (data: Location[], city: string): Location[] => {
    return data.filter((location) => location.town === city)
  }

  useEffect(() => {
    const fetchData = async () => {
      const pref = router.query.pref as string
      const city = router.query.city as string
      if (pref === undefined || city === undefined) {
        return
      }
      const res = await fetch(
        'https://geolonia.github.io/japanese-addresses/api/ja/' + pref + '/' + city + '.json',
      )
      const result = await res.json()
      console.log(result)
      console.log(findLocations(result, city))
      setCity(result)
    }
    fetchData()
  }, [router, router.query.pref, router.query.city])

  if (!city || city?.length === 0) {
    return <div>Loading...</div>
  }

  return <div>city</div>
}

export default Home
