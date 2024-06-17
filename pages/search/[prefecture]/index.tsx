import React, { useMemo } from 'react'
import City from '@/components/City'

interface Pref {
  cities: string[]
  prefecture: string
}

const Home: React.FC<Pref> = ({ cities, prefecture }) => {
  const memoizedProps = useMemo(() => ({ pref: prefecture, cities }), [prefecture, cities])

  return <City {...memoizedProps} />
}

export const getServerSideProps: any = async (context: any) => {
  const { prefecture } = context.params || {}

  if (!prefecture) {
    return {
      notFound: true,
    }
  }

  try {
    const res = await fetch('https://geolonia.github.io/japanese-addresses/api/ja.json')
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
    }
    const data = await res.json()
    const cities = data[prefecture] || []

    return {
      props: {
        cities,
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
