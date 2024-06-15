import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Town from '@/components/Town'

interface Location {
  town: string
  koaza: string
  lat: number
  lng: number
}

const Home: React.FC = () => {
  const router = useRouter()
  const [town, setTown] = useState<Location[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const pref = router.query.pref as string
      const city = router.query.city as string
      if (pref === undefined || city === undefined) {
        return
      }
      const res = await fetch(
        'https://geolonia.github.io/japanese-addresses/api/ja/' +
          encodeURIComponent(pref) +
          '/' +
          encodeURIComponent(city) +
          '.json',
      )
      try {
        const result = await res.json()
        setTown(result)
      } catch (error) {
        console.error('Failed to fetch town data:', error)
      }
    }
    fetchData()
  }, [router, router.query.pref, router.query.city])

  if (!town || town?.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <Town
      pref={router.query.pref as string}
      city={router.query.city as string}
      townes={town as Location[]}
    />
  )
}

export default Home
