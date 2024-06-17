import React from 'react'
import { createHourlyData } from '@/lib/utils_db'
import { VStack, Heading } from '@yamada-ui/react'
import { toZonedTime } from 'date-fns-tz'
import WeatherMap from '@/components/WeatherMap'

interface HourlyData {
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
}

// interface WeatherData {
//   latitude: number
//   longitude: number
//   weather: {
//     hourly: HourlyData
//   }
// }

interface ChartData {
  [key: string]: {
    temp: { name: string; 気温: number }[]
    rain: { name: string; 降水確率: number }[]
  }
}

interface WeatherMap {
  [key: string]: HourlyData
}

const styles = {
  container: {
    width: '90%',
    margin: '20px auto',
    padding: '30px',
    borderRadius: '10px',
    border: '0.2rem solid',
    borderColor: '#6592f1',
    overflowX: 'auto' as 'auto',
  },
  heading: {
    margin: '0 auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '10px auto',
    textAlign: 'center',
    overflowX: 'auto' as 'auto',
  },
  thTd: {
    padding: '2px',
    border: '1px solid #ddd',
  },
  th: {
    backgroundColor: '#6592f1',
    color: 'white',
    position: 'sticky',
    padding: '12px',
  },
  dateRow: {
    backgroundColor: '#6592f1',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    padding: '12px',
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
      name: String(times) as string,
      気温: temperature_2m[index] as number,
    })
    chartGroup[date].rain.push({
      name: String(times) as string,
      降水確率: precipitation_probability[index] as number,
    })

    times += 1
    if (times === 24) {
      times = 0
    }
  })
  const groupedData: WeatherMap = {}
  time.forEach((timeString: string, index: number) => {
    const date = getDate(timeString)
    if (!groupedData[date]) {
      groupedData[date] = {
        time: [],
        temperature_2m: [],
        precipitation_probability: [],
      }
    }
    groupedData[date].time.push(timeString)
    groupedData[date].temperature_2m.push(temperature_2m[index])
    groupedData[date].precipitation_probability.push(precipitation_probability[index])
  })

  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <VStack style={styles.container}>
      <Heading size='md'>1週間分の天気</Heading>
      <table style={styles.table as any}>
        <thead>
          <tr>
            <th style={{ ...styles.thTd, ...(styles.th as any) }}></th>
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
                <td style={styles.thTd}>気温 (°C)</td>
                {groupedData[date].temperature_2m.map((temp, index) => (
                  <td key={index} style={styles.thTd}>
                    {temp}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={styles.thTd}>降雨率 (%)</td>
                {groupedData[date].precipitation_probability.map((prob, index) => (
                  <td key={index} style={styles.thTd}>
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
