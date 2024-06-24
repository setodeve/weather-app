import React, { useCallback, useMemo } from 'react'
import { createHourlyData } from '@/lib/utils_db'
import { VStack, Heading, Button } from '@yamada-ui/react'
import { toZonedTime } from 'date-fns-tz'
import { useRouter } from 'next/router'
import type { CSSProperties } from 'react'
const styles: { [key: string]: CSSProperties } = {
  container: {
    width: '90%',
    margin: '20px auto',
    padding: '30px',
    borderRadius: '10px',
    border: '0.2rem solid #6592f1',
    overflowX: 'auto' as 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '10px auto',
    textAlign: 'center',
    overflowX: 'auto' as 'auto',
  },
  thTd: { fontSize: '13px' },
  thTitle: {
    fontSize: '13px',
    textAlign: 'center',
    paddingTop: '3px',
    backgroundColor: '#1453d0',
    color: 'white',
    fontWeight: 'bold',
  },
  thTdTitle: {
    paddingTop: '2px',
    fontSize: '13px',
    fontWeight: '600',
  },
  th: {
    backgroundColor: '#1453d0',
    color: 'white',
    position: 'sticky',
    padding: '5px',
    textAlign: 'center',
  },

  dataTmpTb: {
    border: '0.1rem solid #ddd',
  },
  dataRainTb: {
    border: '0.1rem solid #ddd',
  },
  dateRow: {
    backgroundColor: '#1453d0',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    padding: '5px',
    fontSize: '15px',
  },
  center: {
    margin: '0 auto',
  },
}

interface HourlyData {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
}

interface WeatherMapData {
  [key: string]: HourlyData
}

const Home = ({ weather }: any) => {
  const hourlyWeather = weather.hourly || weather
  const { time, temperature_2m, precipitation_probability } = hourlyWeather
  const router = useRouter()
  const getDate = (timeString: string) => {
    const date = toZonedTime(new Date(timeString), 'Asia/Tokyo')
    return date.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }).split(' ')[0]
  }
  const goHome = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()
      router.push('/')
    },
    [router],
  )

  const groupedData: WeatherMapData = useMemo(() => {
    const group: WeatherMapData = {}

    time.forEach((timeString: string, index: number) => {
      const date = getDate(timeString)
      if (!group[date]) {
        group[date] = {
          time: [],
          temperature_2m: [],
          precipitation_probability: [],
        }
      }
      group[date].time.push(timeString)
      group[date].temperature_2m.push(temperature_2m[index])
      group[date].precipitation_probability.push(precipitation_probability[index])
    })

    return group
  }, [time, temperature_2m, precipitation_probability])

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])

  return (
    <VStack style={styles.container}>
      <Heading size='md'>1週間分の天気</Heading>
      <table style={styles.table as any}>
        <thead>
          <tr style={styles.tr}>
            <th style={{ ...styles.thTitle }}>Day \ Time</th>
            {hours.map((time) => (
              <th key={time} style={{ ...styles.thTd, ...(styles.th as any) }}>
                {time}時
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((date) => (
            <React.Fragment key={date}>
              <br />
              <tr>
                <td colSpan={hours.length + 1} style={{ ...styles.dateRow }}>
                  {date}
                </td>
              </tr>
              <tr style={styles.tr}>
                <td style={{ ...styles.thTdTitle, ...styles.dataTmpTb }}>気温 (°C)</td>
                {groupedData[date].temperature_2m.map((temp, index) => (
                  <td key={index} style={{ ...styles.thTd, ...styles.dataTmpTb }}>
                    {temp}
                  </td>
                ))}
              </tr>
              <tr style={styles.tr}>
                <td style={{ ...styles.thTdTitle, ...styles.dataRainTb }}>降雨率 (%)</td>
                {groupedData[date].precipitation_probability.map((prob, index) => (
                  <td key={index} style={{ ...styles.thTd, ...styles.dataRainTb }}>
                    {prob}
                  </td>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <iframe
        src={`https://maps.google.co.jp/maps?output=embed&q=${weather.latitude},${weather.longitude}&z=13`}
      ></iframe>
      <Button
        variant='outline'
        colorScheme='blue'
        onClick={goHome}
        width='40%'
        style={styles.center}
      >
        ホームに戻る
      </Button>
    </VStack>
  )
}

export const getServerSideProps: any = async (context: any) => {
  const place = context.params?.place
  const { lat, lng } = place ? { lat: place[0], lng: place[1] } : { lat: 35.6895, lng: 139.6923 }

  const weather = await createHourlyData(lat as number, lng as number)
  const serializedWeatherData = weather.created_date
    ? { ...weather, created_date: weather.created_date?.toISOString() }
    : { ...weather }

  return {
    props: {
      weather: serializedWeatherData,
    },
  }
}

export default Home
