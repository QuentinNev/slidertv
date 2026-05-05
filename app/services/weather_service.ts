const API_URL =
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=46.948&longitude=7.447' +
  '&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m' +
  '&timezone=Europe%2FZurich' +
  '&wind_speed_unit=kmh'

const TTL_MS = 10 * 60 * 1000

export interface WeatherData {
  temperature: number
  apparentTemperature: number
  weathercode: number
  windspeed: number
  humidity: number
  fetchedAt: string
}

interface CacheEntry {
  data: WeatherData
  timestamp: number
}

class WeatherService {
  #cache: CacheEntry | null = null

  async get(): Promise<WeatherData> {
    if (this.#cache && Date.now() - this.#cache.timestamp < TTL_MS) {
      return this.#cache.data
    }
    const data = await this.#fetch()
    this.#cache = { data, timestamp: Date.now() }
    return data
  }

  async #fetch(): Promise<WeatherData> {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`Open-Meteo responded with ${res.status}`)
    const json = await res.json()
    const c = json.current
    return {
      temperature: c.temperature_2m,
      apparentTemperature: c.apparent_temperature,
      weathercode: c.weathercode,
      windspeed: c.windspeed_10m,
      humidity: c.relativehumidity_2m,
      fetchedAt: c.time,
    }
  }
}

export default new WeatherService()
