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

const Town: React.FC<TownData> = ({ pref, city, townes }) => {
  const renderedTownes = useMemo(
    () =>
      townes.length > 0 ? (
        townes.map((town) =>
          town.koaza === '' ? (
            <GridItem key={town.town}>
              <Heading size='xs' style={styles.heading}>
                <Link
                  href={`/weather/${encodeURIComponent(town.lat)}/${encodeURIComponent(town.lng)}`}
                >
                  {town.town}
                </Link>
              </Heading>
            </GridItem>
          ) : null,
        )
      ) : (
        <Heading size='md' style={styles.heading}>
          No towns available
        </Heading>
      ),
    [townes],
  )

  return (
    <VStack style={styles.container}>
      <Heading size='sm'>{`${pref} / ${city}`}</Heading>
      <Grid templateColumns='repeat(6, 2fr)' gap='md' style={styles.grid}>
        {renderedTownes}
      </Grid>
    </VStack>
  )
}

export default Town
