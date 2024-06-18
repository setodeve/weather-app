import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Heading, VStack, Button, Box, Image, HStack } from '@yamada-ui/react'
import SearchBox from '@/components/SearchBox'

const styles = {
  container: {
    width: '60%',
    margin: '50px auto',
    padding: '30px',
    borderRadius: '10px',
    border: '0.2rem solid',
    borderColor: '#6592f1',
  },
  center: {
    margin: '0 auto',
  },
}

const Home = () => {
  const router = useRouter()

  const getLocation = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            router.push(
              `/weather/${encodeURIComponent(position.coords.latitude)}/${encodeURIComponent(position.coords.longitude)}`,
              undefined,
              { shallow: true },
            )
          },
          () => {
            alert('位置情報が取得できませんでした。')
          },
          { timeout: 5000 },
        )
      }
    },
    [router],
  )

  const handlePlacesChanged = (places: google.maps.places.PlaceResult[]) => {
    const lat = places[0].geometry?.location?.lat() as number
    const lng = places[0].geometry?.location?.lng() as number

    router.push(`/weather/${encodeURIComponent(lat)}/${encodeURIComponent(lng)}`, undefined, {
      shallow: true,
    })
  }
  return (
    <VStack style={styles.container}>
      <VStack style={styles.center}>
        <HStack style={styles.center}>
          <Image width='50px' src='太陽.png' alt='太陽' />
          <Heading size='sm'>
            旅先の天気を確認してみよう。以下の2つの方法から天気がみれます！
          </Heading>
          <Image width='50px' src='雨.png' alt='雨' />
        </HStack>
      </VStack>
      <VStack style={styles.center}>
        <Heading size='sm' style={styles.center}>
          現在地から天気を確認
        </Heading>
        <Button colorScheme='blue' onClick={getLocation} width='40%' style={styles.center}>
          現在地を取得
        </Button>
      </VStack>
      <VStack>
        <Heading size='sm' style={styles.center}>
          行き先を検索して確認
        </Heading>
        <SearchBox placeholder='行き先を入力' onPlacesChanged={handlePlacesChanged} />
      </VStack>
    </VStack>
  )
}

export const getStaticProps = async () => {
  return {
    props: {},
  }
}

export default Home
