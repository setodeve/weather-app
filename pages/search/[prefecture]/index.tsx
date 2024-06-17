import React from 'react'
import City from '@/components/City'

interface Pref {
  cities: string[]
  prefecture: string
}

const Home = ({ cities, prefecture }: Pref) => {
  return <City pref={prefecture} cities={cities} />
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
    const cities = data[prefecture as string] || []

    return {
      props: {
        cities,
        prefecture: prefecture as string,
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
