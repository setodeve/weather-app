import React from 'react'
import Region from '@/components/Region'
import { Grid, GridItem, Heading, Box, Link } from '@yamada-ui/react'

const styles = {
  container: {
    width: '70%',
    margin: '50px auto',
    padding: '30px',
    borderRadius: '10px',
    border: '0.2rem solid',
    borderColor: '#2563eb',
  },
  heading: {
    margin: '0 auto',
  },
  box: {
    padding: '5px',
    borderRadius: '10px',
    border: '0.2rem solid',
    borderColor: '#2563eb',
  },
  test: {
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

const Home: React.FC = () => {
  return (
    <Box>
      {/* <Region/> */}
      <Heading size='md' style={styles.test}>
        行き先の都道府県を選択してください
      </Heading>
      <Grid templateColumns='repeat(10, 1fr)' gap='md' style={styles.container}>
        {prefectures.map((prefecture) => {
          return (
            <GridItem key={prefecture}>
              <Heading size='xs' key={prefecture} style={styles.heading}>
                <Link href={`/search/pref?pref=${encodeURIComponent(prefecture)}`}>
                  {prefecture}
                </Link>
              </Heading>
            </GridItem>
          )
        })}
      </Grid>
    </Box>
  )
}

export default Home
