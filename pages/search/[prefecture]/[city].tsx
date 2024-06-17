import React, { useMemo } from 'react'
import Town from '@/components/Town'

interface Location {
  town: string
  koaza: string
  lat: number
  lng: number
}

interface TownProps {
  prefecture: string
  city: string
  town: Location[]
}

const Home: React.FC<TownProps> = ({ prefecture, city, town }) => {
  const memoizedTownProps = useMemo(
    () => ({ pref: prefecture, city: city, townes: town }),
    [prefecture, city, town],
  )

  return <Town {...memoizedTownProps} />
}

export const getServerSideProps: any = async (context: any) => {
  const { prefecture, city } = context.params || {}

  if (!prefecture || !city) {
    return {
      notFound: true,
    }
  }

  try {
    const res = await fetch(
      `https://geolonia.github.io/japanese-addresses/api/ja/${encodeURIComponent(prefecture)}/${encodeURIComponent(city)}.json`,
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
    }

    const town: Location[] = await res.json()

    return {
      props: {
        town,
        city,
        prefecture,
      },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      notFound: true,
    }
  }
}

export default Home
