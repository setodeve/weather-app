import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import City from '@/components/City'

const Home: React.FC = () => {
  const router = useRouter()
  const [cities, setCities] = useState<string[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const pref = router.query.pref as string
      if (pref === undefined) {
        return
      }
      const res = await fetch('https://geolonia.github.io/japanese-addresses/api/ja.json')
      const result = await res.json()
      setCities(result[pref])
    }
    fetchData()
  }, [router, router.query.pref])

  if (!cities || cities?.length === 0) {
    return <div>Loading...</div>
  }

  return <City pref={router.query.pref as string} cities={cities as string[]} />
}
export default Home
