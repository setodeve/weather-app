import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { Heading, VStack, Button, Image, Loading, HStack } from '@yamada-ui/react'
import SearchBox from '@/components/SearchBox'
import type { CSSProperties } from 'react'

const styles: { [key: string]: CSSProperties } = {
  container: {
    width: '75%',
    maxWidth: '500px',
    minWidth: '450px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '10px',
    border: '0.2rem solid',
    borderColor: '#6592f1',
  },
  center: {
    margin: '0 auto',
  },
  loadingCenter: {
    margin: '0 auto',
    position: 'absolute',
    top: '30%',
    left: '50%',
  },
}

const Home = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const getLocation = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()
      setLoading(true)
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
          } else {
            reject(new Error('Geolocation not supported'))
          }
        })
        const { latitude, longitude } = position.coords
        const encodedLat = encodeURIComponent(latitude)
        const encodedLng = encodeURIComponent(longitude)

        setTimeout(() => {
          router.push(`/weather/${encodedLat}/${encodedLng}`, undefined, { shallow: true })
        }, 0)
      } catch (error) {
        console.error('位置情報の取得に失敗しました。', error)
        setLoading(false)
      }
    },
    [router],
  )

  const handlePlacesChanged = (places: google.maps.places.PlaceResult[]) => {
    const lat = places[0].geometry?.location?.lat() as number
    const lng = places[0].geometry?.location?.lng() as number
    setLoading(true)
    router.push(`/weather/${encodeURIComponent(lat)}/${encodeURIComponent(lng)}`, undefined, {
      shallow: true,
    })
  }

  return (
    <VStack>
      {loading ? (
        <Loading variant='circles' size='6xl' style={styles.loadingCenter} />
      ) : (
        <VStack style={styles.container}>
          <HStack style={styles.center}>
            <Image width='50px' src='太陽.png' alt='太陽' />
            <Heading size='xs' minWidth='10%'>
              旅先の天気を確認してみよう!
              <br />
              以下の2つの方法から天気がみれます!
            </Heading>
            <Image width='50px' src='雨.png' alt='雨' />
          </HStack>
          <VStack style={styles.center}>
            <Heading size='sm' style={styles.center}>
              現在地から天気を確認
            </Heading>
            <Button
              colorScheme='blue'
              onClick={getLocation}
              style={styles.center}
              disabled={loading}
            >
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
      )}
    </VStack>
  )
}

export const getStaticProps = async () => {
  return {
    props: {},
  }
}

export default Home
