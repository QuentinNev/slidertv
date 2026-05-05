import type { HttpContext } from '@adonisjs/core/http'
import weatherService from '#services/weather_service'
import WeatherLocation from '#models/weather_location'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    const location = await WeatherLocation.first()
    const weather = location
      ? await weatherService.get(location.latitude, location.longitude).catch(() => null)
      : null
    return inertia.render('home', { weather, location: location ?? null })
  }
}
