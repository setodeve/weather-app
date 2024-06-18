import React, { useCallback, useMemo } from 'react'
import { createHourlyData } from '@/lib/utils_db'
import { VStack, Heading, Button } from '@yamada-ui/react'
import { toZonedTime } from 'date-fns-tz'
import WeatherMap from '@/components/WeatherMap'
import { useRouter } from 'next/router'

const styles = {
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
  thTdTitle: {
    paddingTop: '2px',
    fontSize: '13px',
  },
  th: {
    backgroundColor: '#6592f1',
    color: 'white',
    position: 'sticky',
    padding: '5px',
    textAlign: 'center',
  },
  tr: {
    borderBottom: '0.2rem solid white',
  },
  dataTmpTb: {
    borderBottom: '0.1rem solid #ddd',
    borderRight: '0.1rem  solid #ddd',
    borderLeft: '0.1rem solid #ddd',
  },
  dataRainTb: {
    borderRight: '0.1rem  solid #ddd',
    borderLeft: '0.1rem solid #ddd',
  },
  dateRow: {
    backgroundColor: '#6592f1',
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
  const lat = Number(weather.latitude)
  const log = Number(weather.longitude)

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
      <Button colorScheme='blue' onClick={goHome} width='40%' style={styles.center}>
        ホームに戻る
      </Button>

      <Heading size='md'>1週間分の天気</Heading>
      <table style={styles.table as any}>
        <thead>
          <tr style={styles.tr}>
            <th style={{ ...styles.thTd }}></th>
            {hours.map((time) => (
              <th key={time} style={{ ...styles.thTd, ...(styles.th as any) }}>
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedData).map((date) => (
            <React.Fragment key={date}>
              <tr>
                <td colSpan={hours.length + 1} style={styles.dateRow as any}>
                  {date}
                </td>
              </tr>
              <tr>
                <td style={{ ...styles.thTdTitle, ...styles.dataTmpTb }}>気温 (°C)</td>
                {groupedData[date].temperature_2m.map((temp, index) => (
                  <td key={index} style={{ ...styles.thTd, ...styles.dataTmpTb }}>
                    {temp}
                  </td>
                ))}
              </tr>
              <tr>
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
      <WeatherMap lat={lat} lng={log} />
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
