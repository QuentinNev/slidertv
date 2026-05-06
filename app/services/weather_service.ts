// Caches weather data for 10 minutes to avoid excessive API calls
const TTL_MS = 10 * 60 * 1000

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

interface CacheEntry {
  data: WeatherData
  timestamp: number
}

class WeatherService {
  #cache = new Map<string, CacheEntry>()

  async get(latitude: number, longitude: number): Promise<WeatherData> {
    const key = `${latitude},${longitude}`
    const cached = this.#cache.get(key)
    if (cached && Date.now() - cached.timestamp < TTL_MS) {
      return cached.data
    }
    const data = await this.#fetch(latitude, longitude)
    this.#cache.set(key, { data, timestamp: Date.now() })
    return data
  }

  invalidate(latitude: number, longitude: number) {
    this.#cache.delete(`${latitude},${longitude}`)
  }

  async #fetch(latitude: number, longitude: number): Promise<WeatherData> {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m` +
      `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
      `&forecast_days=3` +
      `&timezone=Europe%2FZurich` +
      `&wind_speed_unit=kmh`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`Open-Meteo responded with ${res.status}`)

    const json = (await res.json()) as {
      current: {
        temperature_2m: number
        apparent_temperature: number
        weathercode: number
        windspeed_10m: number
        relativehumidity_2m: number
        time: string
      }
      daily: {
        time: string[]
        temperature_2m_max: number[]
        temperature_2m_min: number[]
        weathercode: number[]
      }
    }

    const c = json.current
    const d = json.daily

    return {
      temperature: c.temperature_2m,
      apparentTemperature: c.apparent_temperature,
      weathercode: c.weathercode,
      windspeed: c.windspeed_10m,
      humidity: c.relativehumidity_2m,
      fetchedAt: c.time,
      // Shows next 2 days (indices 1 and 2), not current day (index 0) which is in current
      forecast: [1, 2].map((i) => ({
        date: d.time[i],
        weathercode: d.weathercode[i],
        tempMax: d.temperature_2m_max[i],
        tempMin: d.temperature_2m_min[i],
      })),
    }
  }
}

export default new WeatherService()
