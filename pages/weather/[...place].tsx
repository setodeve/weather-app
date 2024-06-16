import React from 'react'
import { GetServerSideProps } from 'next'

interface HourlyUnits {
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

interface WeatherData {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  hourly_units: HourlyUnits
  weather: {
    hourly: HourlyData
  }
}

interface GroupedData {
  [key: string]: HourlyData
}

const Home = ({ weather }: WeatherData) => {
  const groupedData: GroupedData = {}
  const { time, temperature_2m, precipitation_probability, precipitation } = weather.hourly
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

  if (!lat || !lng) {
    return {
      notFound: true,
    }
  }

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&hourly=temperature_2m,precipitation_probability,precipitation&timezone=Asia%2FTokyo`,
    )
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
    }
    const weather = await res.json()

    return {
      props: {
        weather,
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