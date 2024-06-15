import React from'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

interface Place {
  lat: number
  lng: number
}

interface HourlyUnits {
  time: string;
  temperature_2m: string;
  precipitation_probability: string;
  precipitation: string;
}

interface HourlyData {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  precipitation: number[];
}

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: HourlyUnits;
  hourly: HourlyData;
}


const Home: React.FC = () => {
  const router = useRouter()
  const [weather, setWeather] = useState<{hourly: HourlyData} | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const lat = router.query.lat as string
      const lng = router.query.lng as string
      if (lat === undefined || lng === undefined) {
        return
      }
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,precipitation_probability,precipitation&timezone=Asia%2FTokyo`,
      )
      const result = await res.json()
      setWeather(result)
      console.log(result)
    }
    fetchData()
  }, [router, router.query.lat, router.query.lng])

  if (!weather) {
    return <div>Loading...</div>
  }

  const { time, temperature_2m, precipitation_probability, precipitation } = weather.hourly;

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return `${date.getHours()}`;
  };
  
  const getDate = (timeString: string) => {
    const date = new Date(timeString);
    // return date.toISOString().split('T')[0];
    return date.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    }).split(' ')[0]
  };
  
  const groupedData: { [key: string]: { time: string[], temperature_2m: number[], precipitation_probability: number[], precipitation: number[] } } = {};
  
  time.forEach((timeString, index) => {
    const date = getDate(timeString);
    if (!groupedData[date]) {
      groupedData[date] = { time: [], temperature_2m: [], precipitation_probability: [], precipitation: [] };
    }
    groupedData[date].time.push(timeString);
    groupedData[date].temperature_2m.push(temperature_2m[index]);
    groupedData[date].precipitation_probability.push(precipitation_probability[index]);
    groupedData[date].precipitation.push(precipitation[index]);
  });

  return (
    <table border={1}>
      <thead>
        <tr>
          <th>パラメーター</th>
          {time.slice(0, 24).map((time, index) => (
            <th key={index}>{formatTime(time)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(groupedData).map((date, dateIndex) => (
          <React.Fragment key={dateIndex}>
            <tr>
              <td colSpan={25} style={{ textAlign: 'center', fontWeight: 'bold' }}>{date}</td>
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
  );
}

export default Home