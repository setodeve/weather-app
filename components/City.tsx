import { Grid, GridItem, Heading, VStack, Link } from '@yamada-ui/react'

const styles = {
  container: {
    width: '70%',
    margin: '0 auto',
  },
  city: {
    margin: '20px 0',
  },
}

interface CityData {
  pref: string
  cities: string[]
}

const City = ({ pref, cities }: CityData) => {
  if (!pref || !cities) {
    return null
  }
  return (
    <VStack style={styles.container}>
      <Heading size='md'>{pref}</Heading>
      <Grid templateColumns='repeat(6, 2fr)' gap='md' style={styles.city}>
        {cities.map((city: string) => (
          <GridItem key={city}>
            <Link href={`/search/${encodeURIComponent(pref)}/${encodeURIComponent(city)}`}>
              {city}
            </Link>
          </GridItem>
        ))}
      </Grid>
    </VStack>
  )
}

export default City
