import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import weatherService from '#services/weather_service'
import WeatherLocation from '#models/weather_location'

const locationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    latitude: vine.number().range([-90, 90]),
    longitude: vine.number().range([-180, 180]),
  })
)

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const location = await WeatherLocation.first()
    console.log("location",location);
    return inertia.render('dashboard', { location: location ?? null })
  }

  async update({ request, response, session }: HttpContext) {
    const { name, latitude, longitude } = await request.validateUsing(locationValidator)

    const existing = await WeatherLocation.first()
    if (existing) {
      weatherService.invalidate(existing.latitude, existing.longitude)
      await existing.merge({ name, latitude, longitude }).save()
    } else {
      await WeatherLocation.create({ name, latitude, longitude })
    }

    session.flash('success', `Localisation mise à jour : ${name}`)
    return response.redirect().toRoute('dashboard')
  }
}
