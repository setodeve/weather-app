import { PrismaClient } from '@prisma/client'
import { startOfDay, endOfDay, subDays } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const prisma = new PrismaClient()

interface HourlyData {
  latitude: number
  longitude: number
  time: string[]
  temperature_2m: number[]
  precipitation_probability: number[]
  created_date: Date
}

const getZonedTimeRange = (date: Date, timezone: string) => {
  const zonedDate = toZonedTime(date, timezone)
  const dateStart = startOfDay(zonedDate)
  const dateEnd = endOfDay(zonedDate)
  return { dateStart, dateEnd }
}

const parseHourlyData = async (lat: number, lng: number): Promise<HourlyData | null> => {
  const { dateStart, dateEnd } = getZonedTimeRange(new Date(), 'Asia/Tokyo')

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

export const deletePreviousDayData = async () => {
  const { dateStart: previousDayStart, dateEnd: previousDayEnd } = getZonedTimeRange(
    subDays(new Date(), 1),
    'Asia/Tokyo',
  )

  try {
    await prisma.hourlyData.deleteMany({
      where: {
        created_date: {
          gte: previousDayStart,
          lt: previousDayEnd,
        },
      },
    })
  } catch (error) {
    console.error('Error deleting previous day data:', error)
    throw error
  }
}

export const createHourlyData = async (lat: number, lng: number): Promise<HourlyData> => {
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

    const newData: HourlyData = {
      latitude: parseFloat(String(lat)),
      longitude: parseFloat(String(lng)),
      time: weather.hourly.time,
      temperature_2m: weather.hourly.temperature_2m,
      precipitation_probability: weather.hourly.precipitation_probability,
      created_date: toZonedTime(new Date(), 'Asia/Tokyo'),
    }

    await prisma.hourlyData.create({
      data: newData as any,
    })

    return newData
  } catch (error) {
    console.error('Error creating hourly data:', error)
    throw error
  }
}

export default createHourlyData
