import React from 'react'
import { GetServerSideProps } from 'next'
import { createHourlyData } from '@/lib/utils_db'

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
  precipitation: number[]
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

interface GroupedData {
  [key: string]: HourlyData
}

const Home = ({ weather }: any) => {
  const groupedData: GroupedData = {}
  const { time, temperature_2m, precipitation_probability, precipitation } =
    weather.hourly == undefined ? weather : weather.hourly
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const getDate = (timeString: string) => {
    const date = new Date(timeString)
    return date
      .toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
      })
      .split(' ')[0]
  }

  time.forEach((timeString: string, index: number) => {
    const date = getDate(timeString)
    if (!groupedData[date]) {
      groupedData[date] = {
        time: [],
        temperature_2m: [],
        precipitation_probability: [],
        precipitation: [],
      }
    }
    groupedData[date].time.push(timeString)
    groupedData[date].temperature_2m.push(temperature_2m[index])
    groupedData[date].precipitation_probability.push(precipitation_probability[index])
    groupedData[date].precipitation.push(precipitation[index])
  })

  return (
    <table border={1}>
      <thead>
        <tr>
          <th>パラメーター</th>
          {hours.map((time) => (
            <th key={time}>{time}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(groupedData).map((date) => (
          <React.Fragment key={date}>
            <tr>
              <td colSpan={25} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                {date}
              </td>
            </tr>
            <tr>
              <td>気温 (°C)</td>
              {groupedData[date].temperature_2m.map((temp, index) => (
                <td key={index}>{temp}</td>
              ))}
            </tr>
            <tr>
              <td>降雨率 (%)</td>
              {groupedData[date].precipitation_probability.map((prob, index) => (
                <td key={index}>{prob}</td>
              ))}
            </tr>
            <tr>
              <td>降雨量 (mm)</td>
              {groupedData[date].precipitation.map((precip, index) => (
                <td key={index}>{precip}</td>
              ))}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const place = context.params?.place
  const { lat, lng } = place ? { lat: place[0], lng: place[1] } : { lat: 35.6895, lng: 139.6923 }

  try {
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
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      notFound: true,
    }
  }
}

export default Home
