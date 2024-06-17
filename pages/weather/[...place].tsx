import React, { useMemo } from 'react'
import { GetServerSideProps } from 'next'
import { createHourlyData } from '@/lib/utils_db'
import { VStack, HStack, Heading } from '@yamada-ui/react'
import { LineChart } from '@yamada-ui/charts'
import { toZonedTime } from 'date-fns-tz'
import Maps from '@/components/GoogleMap'

interface HourlyUnitsData {
  time: string
  temperature_2m: string
  precipitation_probability: string
  precipitation: string
}

interface HourlyData {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
}

interface CurrentData {
  time: Date
  interval: number
  temperature_2m: number
  wind_speed_10m: number
}

interface WeatherData {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  hourly_units: HourlyUnitsData
  weather: {
    hourly: HourlyData
  }
  current: CurrentData
}

interface ChartData {
  [key: string]: {
    temp: { name: string; 気温: number }[]
    rain: { name: string; 降水確率: number }[]
  }
}

const styles = {
  container: {
    width: '90%',
    margin: '50px auto',
    padding: '50px',
    borderRadius: '10px',
    border: '0.2rem solid',
    borderColor: '#2563eb',
  },
  heading: {
    margin: '0 auto',
  },
  grid: {
    margin: '20px 0',
  },
  scroll: {
    overflowX: 'auto' as 'auto',
  },
}

const Home = ({ weather }: any) => {
  const hourlyWeather = weather.hourly || weather
  const { time, temperature_2m, precipitation_probability } = hourlyWeather
  const getDate = (timeString: string) => {
    const date = toZonedTime(new Date(timeString), 'Asia/Tokyo')
    return date
      .toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
      })
      .split(' ')[0]
  }
  const lat = Number(weather.latitude)
  const log = Number(weather.longitude)
  const chartGroup: ChartData = {}

  const stands: any = useMemo(() => [{ dataKey: '気温', color: 'orange.500' }], [])
  const rains: any = useMemo(() => [{ dataKey: '降水確率', color: 'blue.500' }], [])
  let times = 0

  time.forEach((timeString: string, index: number) => {
    const date = getDate(timeString)
    if (!chartGroup[date]) {
      chartGroup[date] = {
        temp: [],
        rain: [],
      }
    }

    chartGroup[date].temp.push({
      name: `${times}時`,
      気温: temperature_2m[index] as number,
    })
    chartGroup[date].rain.push({
      name: `${times}時`,
      降水確率: precipitation_probability[index] as number,
    })

    times += 1
    if (times === 24) {
      times = 0
    }
  })
  const chartsData = useMemo(() => chartGroup, [])
  return (
    <VStack style={styles.container}>
      <Heading size='md'>1週間分の天気</Heading>
      {Object.keys(chartsData).map((date) => (
        <VStack key={date}>
          <Heading size='sm'>{date}</Heading>
          <HStack style={styles.scroll} key={date}>
            <VStack>
              <Heading size='xs'>気温</Heading>
              <LineChart
                size='sm'
                unit='℃'
                data={chartsData[date].temp as any}
                series={stands}
                dataKey='name'
              />
            </VStack>
            <VStack>
              <Heading size='xs'>降水確率</Heading>
              <LineChart
                size='sm'
                unit='%'
                data={chartsData[date].rain as any}
                series={rains}
                dataKey='name'
              />
            </VStack>
          </HStack>
        </VStack>
      ))}
      <Maps lat={lat} lng={log} />
    </VStack>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const place = context.params?.place
  const { lat, lng } = place ? { lat: place[0], lng: place[1] } : { lat: 35.6895, lng: 139.6923 }

  const weather = await createHourlyData(lat as number, lng as number)
  const serializedWeatherData =
    weather.created_date != undefined
      ? {
          ...weather,
          created_date: weather.created_date?.toISOString(),
        }
      : { ...weather }
  return {
    props: {
      weather: serializedWeatherData,
    },
  }
}

export default Home
