import type { HttpContext } from '@adonisjs/core/http'
import weatherService from '#services/weather_service'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    const weather = await weatherService.get().catch(() => null)
    return inertia.render('home', { weather })
  }
}
