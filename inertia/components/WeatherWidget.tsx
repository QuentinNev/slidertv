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
        <div className="tv-weather-icon">⚠️</div>
        <div className="tv-weather-desc">Météo indisponible</div>
      </div>
    )
  }

  const current = decodeWeather(weather.weathercode)

  return (
    <div className="tv-weather">
      <div className="tv-weather-now">
        <div className="tv-weather-icon">{current.icon}</div>
        <div className="tv-weather-temp">{Math.round(weather.temperature)}°C</div>
        <div className="tv-weather-desc">{current.label}</div>
        <div className="tv-weather-feels">Ressenti {Math.round(weather.apparentTemperature)}°C</div>
        {locationName && <div className="tv-weather-loc">{locationName}</div>}
        <div className="tv-weather-details">
          <span>💧 {weather.humidity}%</span>
          <span>💨 {Math.round(weather.windspeed)} km/h</span>
        </div>
      </div>

      <div className="tv-weather-forecast">
        {weather.forecast.map((day) => {
          const f = decodeWeather(day.weathercode)
          return (
            <div key={day.date} className="tv-forecast-day">
              <span className="tv-forecast-label">{dayLabel(day.date)}</span>
              <span className="tv-forecast-icon">{f.icon}</span>
              <span className="tv-forecast-temps">
                <span className="tv-forecast-max">{Math.round(day.tempMax)}°</span>
                <span className="tv-forecast-min">{Math.round(day.tempMin)}°</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
