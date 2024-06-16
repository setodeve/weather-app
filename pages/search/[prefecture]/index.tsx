import React from 'react'
import { GetServerSideProps } from 'next'
import City from '@/components/City'

interface Pref {
  cities: string[]
  prefecture: string
}

const Home = ({ cities, prefecture }: Pref) => {
  return <City pref={prefecture} cities={cities} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { prefecture } = context.params || {}

  if (!prefecture) {
    return {
      notFound: true,
    }
  }

  try {
    const res = await fetch('https://geolonia.github.io/japanese-addresses/api/ja.json')
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
