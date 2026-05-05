import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import weatherService from '#services/weather_service'
import WeatherLocation from '#models/weather_location'
import AppSetting from '#models/app_setting'
import eventBus from '#services/event_bus'

const locationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    latitude: vine.number().range([-90, 90]),
    longitude: vine.number().range([-180, 180]),
  })
)

const hexColor = vine.string().regex(/^#[0-9a-fA-F]{6}$/)

const colorsValidator = vine.compile(
  vine.object({
    backgroundColor: hexColor,
    accentColor: hexColor,
  })
)

export default class DashboardController {
  async index({ inertia }: HttpContext) {
    const [location, colors] = await Promise.all([WeatherLocation.first(), AppSetting.first()])
    return inertia.render('dashboard', { location: location ?? null, colors: colors ?? null })
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

    eventBus.emit('settings:updated')
    session.flash('success', `Localisation mise à jour : ${name}`)
    return response.redirect().toRoute('dashboard')
  }

  async updateColors({ request, response, session }: HttpContext) {
    const { backgroundColor, accentColor } = await request.validateUsing(colorsValidator)
    const existing = await AppSetting.first()
    if (existing) {
      await existing.merge({ backgroundColor, accentColor }).save()
    } else {
      await AppSetting.create({ backgroundColor, accentColor })
    }

    eventBus.emit('settings:updated')
    session.flash('success', 'Couleurs mises à jour')
    return response.redirect().toRoute('dashboard')
  }
}
