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

interface CityProps {
  pref: string
  cities: string[]
}

const City = ({ pref, cities }: CityProps) => {
  return (
    <VStack style={styles.container}>
      <Heading size='md'>{pref}</Heading>
      <Grid templateColumns='repeat(6, 2fr)' gap='md' style={styles.city}>
        {cities.map((city: string) => (
          <GridItem key={city}>
            <Link
              href={`/search/city?pref=${encodeURIComponent(pref)}&city=${encodeURIComponent(city)}`}
            >
              {city}
            </Link>
          </GridItem>
        ))}
      </Grid>
    </VStack>
  )
}

export default City
