import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import AppSetting from '#models/app_setting'
import WeatherLocation from '#models/weather_location'
import Tenant from '#models/tenant'
import eventBus from '#services/event_bus'
import weatherService from '#services/weather_service'

const hexColor = vine.string().regex(/^#[0-9a-fA-F]{6}$/)

const colorsValidator = vine.compile(
  vine.object({
    backgroundColor: hexColor,
    accentColor: hexColor,
    textColor: hexColor,
  })
)

const locationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    latitude: vine.number().range([-90, 90]),
    longitude: vine.number().range([-180, 180]),
  })
)

export default class AppSettingController {
  async updateColors({ request, response, session, auth }: HttpContext) {
    const { backgroundColor, accentColor, textColor } = await request.validateUsing(colorsValidator)
    const tenantId = auth.user!.tenantId!

    // Creates or updates app colors; ensures tenant-specific configuration
    const existing = await AppSetting.query().where('tenantId', tenantId).first()
    if (existing) {
      await existing.merge({ backgroundColor, accentColor, textColor }).save()
    } else {
      await AppSetting.create({ backgroundColor, accentColor, textColor, tenantId })
    }

    // Notifies all connected SSE clients for this tenant to reload styling
    const tenant = await Tenant.find(tenantId)
    if (tenant) {
      eventBus.emit(`settings:updated:${tenant.slug}`)
    }
    session.flash('success', 'Couleurs mises à jour')
    return response.redirect().toRoute('dashboard')
  }

  async updateLocation({ request, response, session, auth }: HttpContext) {
    const { name, latitude, longitude } = await request.validateUsing(locationValidator)
    const tenantId = auth.user!.tenantId!

    // Invalidates cached weather data for the old location before updating coordinates
    const existing = await WeatherLocation.query().where('tenantId', tenantId).first()
    if (existing) {
      weatherService.invalidate(existing.latitude, existing.longitude)
      await existing.merge({ name, latitude, longitude }).save()
    } else {
      await WeatherLocation.create({ name, latitude, longitude, tenantId })
    }

    // Notifies all connected SSE clients for this tenant to reload weather data
    const tenant = await Tenant.find(tenantId)
    if (tenant) {
      eventBus.emit(`settings:updated:${tenant.slug}`)
    }
    session.flash('success', `Localisation mise à jour : ${name}`)
    return response.redirect().toRoute('dashboard')
  }
}
