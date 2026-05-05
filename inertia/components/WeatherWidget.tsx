import { useState, useEffect } from 'react'

const API_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=46.948&longitude=7.447' +
  '&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m' +
  '&timezone=Europe%2FZurich' +
  '&wind_speed_unit=kmh'

interface WeatherData {
  temperature_2m: number
  apparent_temperature: number
  weathercode: number
  windspeed_10m: number
  relativehumidity_2m: number
}

function decodeWeatherCode(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: 'Ciel dégagé' }
  if (code === 1) return { icon: '🌤️', label: 'Principalement dégagé' }
  if (code === 2) return { icon: '⛅', label: 'Partiellement nuageux' }
  if (code === 3) return { icon: '☁️', label: 'Couvert' }
  if (code <= 48) return { icon: '🌫️', label: 'Brouillard' }
  if (code <= 55) return { icon: '🌦️', label: 'Bruine' }
  if (code <= 65) return { icon: '🌧️', label: 'Pluie' }
  if (code <= 77) return { icon: '❄️', label: 'Neige' }
  if (code <= 82) return { icon: '🌦️', label: 'Averses' }
  if (code <= 86) return { icon: '🌨️', label: 'Averses de neige' }
  return { icon: '⛈️', label: 'Orage' }
}

export default function WeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error()
        const json = await res.json()
        setData(json.current)
      } catch {
        setError(true)
      }
    }
    fetchWeather()
    const t = setInterval(fetchWeather, 10 * 60 * 1000)
    return () => clearInterval(t)
  }, [])

  if (error) {
    return (
      <div className="tv-weather">
        <div className="tv-weather-icon">⚠️</div>
        <div className="tv-weather-desc">Météo indisponible</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="tv-weather">
        <div className="tv-weather-icon">⏳</div>
        <div className="tv-weather-desc">Chargement…</div>
      </div>
    )
  }

  const { icon, label } = decodeWeatherCode(data.weathercode)

  return (
    <div className="tv-weather">
      <div className="tv-weather-icon">{icon}</div>
      <div className="tv-weather-temp">{Math.round(data.temperature_2m)}°C</div>
      <div className="tv-weather-desc">{label}</div>
      <div className="tv-weather-feels">Ressenti {Math.round(data.apparent_temperature)}°C</div>
      <div className="tv-weather-loc">Berne, Suisse</div>
      <div className="tv-weather-details">
        <span>💧 {data.relativehumidity_2m}%</span>
        <span>💨 {Math.round(data.windspeed_10m)} km/h</span>
      </div>
    </div>
  )
}
