export interface DayForecast {
  date: string
  weathercode: number
  tempMax: number
  tempMin: number
}

export interface WeatherData {
  temperature: number
  apparentTemperature: number
  weathercode: number
  windspeed: number
  humidity: number
  fetchedAt: string
  forecast: DayForecast[]
}

function decodeWeather(code: number): { icon: string; label: string } {
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

function dayLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short' })
}

export default function WeatherWidget({
  weather,
  locationName,
}: {
  weather: WeatherData | null
  locationName: string | null
}) {
  if (!weather) {
    return (
      <div className="tv-weather">
        <div className="tv-weather-day">
          <div className="tv-day-icon">⚠️</div>
          <div className="tv-day-desc">Météo indisponible</div>
        </div>
      </div>
    )
  }

  const current = decodeWeather(weather.weathercode)

  return (
    <div className="tv-weather">
      <div className="tv-weather-day">
        <span className="tv-day-label">Auj.</span>
        <div className="tv-day-icon">{current.icon}</div>
        <div className="tv-day-temp">{Math.round(weather.temperature)}°C</div>
        <div className="tv-day-desc">{current.label}</div>
        {locationName && <div className="tv-day-loc">{locationName}</div>}
        <div className="tv-day-details">
          <span>💧 {weather.humidity}%</span>
          <span>💨 {Math.round(weather.windspeed)} km/h</span>
        </div>
      </div>

      {weather.forecast.map((day) => {
        const f = decodeWeather(day.weathercode)
        return (
          <div key={day.date} className="tv-weather-day">
            <span className="tv-day-label">{dayLabel(day.date)}</span>
            <div className="tv-day-icon">{f.icon}</div>
            <div className="tv-day-temp">
              {Math.round(day.tempMax)}°
              <span className="tv-day-temp-min">{Math.round(day.tempMin)}°</span>
            </div>
            <div className="tv-day-desc">{f.label}</div>
          </div>
        )
      })}
    </div>
  )
}
