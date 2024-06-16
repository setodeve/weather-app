import { PrismaClient } from '@prisma/client'
import { startOfDay, endOfDay } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const prisma = new PrismaClient()

interface HourlyData {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  times: string[]
  temperatures_2m: number[]
  precipitation_probabilities: number[]
  precipitations: number[]
  created_date: Date
}

interface PlaceData {
  lat: number
  lng: number
}

async function parseHourlyData(lat: number, lng: number) {
  const zonedDate = toZonedTime(new Date(), 'Asia/Tokyo')
  const dateStart = startOfDay(zonedDate)
  const dateEnd = endOfDay(zonedDate)

  try {
    const data = await prisma.hourlyData.findFirst({
      where: {
        latitude: parseFloat(String(lat)),
        longitude: parseFloat(String(lng)),
        created_date: {
          gte: dateStart,
          lt: dateEnd,
        },
      },
    })

    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const createHourlyData = async (lat: number, lng: number) => {
  try {
    const existingData = await parseHourlyData(lat, lng)

    if (existingData) {
      return existingData
    }

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=&hourly=temperature_2m,precipitation_probability,precipitation&timezone=Asia%2FTokyo`,
    )
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
    }
    const weather = await res.json()

    await (prisma as any).hourlyData.create({
      data: {
        latitude: parseFloat(String(lat)),
        longitude: parseFloat(String(lng)),
        generationtime_ms: weather.generationtime_ms,
        utc_offset_seconds: weather.utc_offset_seconds,
        timezone: weather.timezone,
        timezone_abbreviation: weather.timezone_abbreviation,
        elevation: weather.elevation,
        time: weather.hourly.time,
        temperature_2m: weather.hourly.temperature_2m,
        precipitation_probability: weather.hourly.precipitation_probability,
        precipitation: weather.hourly.precipitation,
        created_date: toZonedTime(new Date(), 'Asia/Tokyo'),
      },
    })

    return weather
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export default createHourlyData
