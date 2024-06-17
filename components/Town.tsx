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
  heading: { margin: '0 auto' },
}

interface LocationData {
  town: string
  koaza: string
  lat: number
  lng: number
}

interface TownData {
  pref: string
  city: string
  townes: LocationData[]
}

const Town = ({ pref, city, townes }: TownData) => {
  return (
    <VStack style={styles.container}>
      <Heading size='sm'>{pref + ' / ' + city}</Heading>
      <Grid templateColumns='repeat(6, 2fr)' gap='md' style={styles.grid}>
        {townes
          ? townes.map((town: LocationData) =>
              town.koaza === '' ? (
                <GridItem key={town.town}>
                  <Heading size='xs' key={city} style={styles.heading}>
                    <Link
                      href={`/weather/${encodeURIComponent(town.lat)}/${encodeURIComponent(town.lng)}`}
                    >
                      {town.town}
                    </Link>
                  </Heading>
                </GridItem>
              ) : null,
            )
          : null}
      </Grid>
    </VStack>
  )
}

export default Town
