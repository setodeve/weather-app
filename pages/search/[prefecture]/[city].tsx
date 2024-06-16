import Town from '@/components/Town'
import { GetServerSideProps } from 'next'

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
const Home = ({ prefecture, city, town }: TownProps) => {
  return <Town pref={prefecture as string} city={city as string} townes={town as Location[]} />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { prefecture, city } = context.params || {}

  if (!prefecture || !city) {
    return {
      notFound: true,
    }
  }

  try {
    const res = await fetch(
      'https://geolonia.github.io/japanese-addresses/api/ja/' +
        encodeURIComponent(prefecture as string) +
        '/' +
        encodeURIComponent(city as string) +
        '.json',
    )
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
    }
    const town = await res.json()

    return {
      props: {
        town,
        city,
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
