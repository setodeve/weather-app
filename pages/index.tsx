import React, { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Grid, GridItem, Heading, VStack, Link, Button, Text } from '@yamada-ui/react'

const styles = {
  container: {
    width: '70%',
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

const prefectures: string[] = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
]

const Home = () => {
  const router = useRouter()

  const getLocation = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (navigator.geolocation) {
        e.preventDefault()
        navigator.geolocation.watchPosition(
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
        )
      }
    },
    [router],
  )

  const renderPrefectures = useMemo(() => {
    return prefectures.map((prefecture) => (
      <GridItem key={prefecture}>
        <Heading size='xs' style={styles.center}>
          <Link href={`/search/${encodeURIComponent(prefecture)}`}>{prefecture}</Link>
        </Heading>
      </GridItem>
    ))
  }, [])

  return (
    <VStack style={styles.container}>
      <VStack style={styles.center}>
        <Text style={styles.center}>
          旅先の天気を確認してみよう。以下の２つの方法から天気がみれるよ！
        </Text>
      </VStack>
      <VStack style={styles.center}>
        <Heading size='md' style={styles.center}>
          現在地から天気を確認する
        </Heading>
        <Button colorScheme='blue' onClick={getLocation} width='40%' style={styles.center}>
          現在地を取得
        </Button>
      </VStack>
      <VStack style={styles.center}>
        <Heading size='md' style={styles.center}>
          住所から天気を確認する
        </Heading>
        <Grid templateColumns='repeat(8, 1fr)' gap='md' style={styles.center}>
          {renderPrefectures}
        </Grid>
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
