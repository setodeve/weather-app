import React, { useMemo } from 'react'
import { Grid, GridItem, Heading, VStack, Link } from '@yamada-ui/react'

const styles = {
  container: {
    width: '70%',
    margin: '50px auto',
    padding: '30px',
    borderRadius: '10px',
    border: '0.2rem solid',
    borderColor: '#6592f1',
  },
  grid: {
    margin: '20px 0',
  },
  heading: {
    margin: '0 auto',
  },
}

interface CityData {
  pref: string
  cities: string[]
}

const City: React.FC<CityData> = ({ pref, cities }) => {
  const renderedCities = useMemo(
    () =>
      cities.map((city) => (
        <GridItem key={city}>
          <Heading size='xs' style={styles.heading}>
            <Link href={`/search/${encodeURIComponent(pref)}/${encodeURIComponent(city)}`}>
              {city}
            </Link>
          </Heading>
        </GridItem>
      )),
    [cities, pref],
  )

  return (
    <VStack style={styles.container}>
      <Heading size='md'>{pref}</Heading>
      <Grid templateColumns='repeat(6, 2fr)' gap='md' style={styles.grid}>
        {renderedCities}
      </Grid>
    </VStack>
  )
}

export default City
