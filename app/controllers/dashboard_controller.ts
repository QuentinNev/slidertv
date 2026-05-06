import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import weatherService from '#services/weather_service'
import WeatherLocation from '#models/weather_location'
import AppSetting from '#models/app_setting'
import Slide from '#models/slide'
import Tenant from '#models/tenant'
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
    textColor: hexColor,
  })
)

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    const tenantId = auth.user!.tenantId!
    const tenant = await Tenant.find(tenantId)
    if (!tenant) {
      return inertia.render('errors/server_error', { status: 500, message: 'Tenant not found' })
    }

    const [location, colors, slides] = await Promise.all([
      WeatherLocation.query().where('tenantId', tenantId).first(),
      AppSetting.query().where('tenantId', tenantId).first(),
      Slide.query().where('tenantId', tenantId).orderBy('order', 'asc'),
    ])
    return inertia.render('dashboard', {
      location: location ?? null,
      colors: colors ?? null,
      slides,
      tenantSlug: tenant.slug,
    })
  }

  async update({ request, response, session, auth }: HttpContext) {
    const { name, latitude, longitude } = await request.validateUsing(locationValidator)
    const tenantId = auth.user!.tenantId!

    const existing = await WeatherLocation.query().where('tenantId', tenantId).first()
    if (existing) {
      weatherService.invalidate(existing.latitude, existing.longitude)
      await existing.merge({ name, latitude, longitude }).save()
    } else {
      await WeatherLocation.create({ name, latitude, longitude, tenantId })
    }

    const tenant = await Tenant.find(tenantId)
    if (tenant) {
      eventBus.emit(`settings:updated:${tenant.slug}`)
    }
    session.flash('success', `Localisation mise à jour : ${name}`)
    return response.redirect().toRoute('dashboard')
  }

  async updateColors({ request, response, session, auth }: HttpContext) {
    const { backgroundColor, accentColor, textColor } = await request.validateUsing(colorsValidator)
    const tenantId = auth.user!.tenantId!

    const existing = await AppSetting.query().where('tenantId', tenantId).first()
    if (existing) {
      await existing.merge({ backgroundColor, accentColor, textColor }).save()
    } else {
      await AppSetting.create({ backgroundColor, accentColor, textColor, tenantId })
    }

    const tenant = await Tenant.find(tenantId)
    if (tenant) {
      eventBus.emit(`settings:updated:${tenant.slug}`)
    }
    session.flash('success', 'Couleurs mises à jour')
    return response.redirect().toRoute('dashboard')
  }
}
