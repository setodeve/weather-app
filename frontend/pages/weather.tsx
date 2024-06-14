import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Weather: React.FC = () => {
  const router = useRouter()
  const [weather, setWeather] = useState<string[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const pref = router.query.pref as string
      const city = router.query.city as string
      const res = await fetch('')
      const result = await res.json()
    }
    fetchData()
  }, [router, router.query.pref])

  if (!weather || weather?.length === 0) {
    return <div>Loading...</div>
  }

  return <div>Weather</div>
}

export default Weather
