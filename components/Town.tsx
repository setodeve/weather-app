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

interface Location {
  town: string
  koaza: string
  lat: number
  lng: number
}

interface TownProps {
  pref: string
  city: string
  townes: Location[]
}

const Town = ({ pref, city, townes }: TownProps) => {
  return (
    <VStack style={styles.container}>
      <Heading size='md'>{pref + ', ' + city}</Heading>
      <Grid templateColumns='repeat(6, 2fr)' gap='md' style={styles.city}>
        {townes
          ? townes.map((town: Location) =>
              town.koaza === '' ? (
                <GridItem key={town.town}>
                  <Link
                    href={`/weather/${encodeURIComponent(town.lat)}/${encodeURIComponent(town.lng)}`}
                  >
                    {town.town}
                  </Link>
                </GridItem>
              ) : null,
            )
          : null}
      </Grid>
    </VStack>
  )
}

export default Town
