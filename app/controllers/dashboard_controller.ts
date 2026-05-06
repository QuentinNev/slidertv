import type { HttpContext } from '@adonisjs/core/http'
import WeatherLocation from '#models/weather_location'
import AppSetting from '#models/app_setting'
import Slide from '#models/slide'
import Tenant from '#models/tenant'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    const tenantId = auth.user!.tenantId!
    const tenant = await Tenant.find(tenantId)
    if (!tenant) {
      return inertia.render('errors/server_error', { status: 500, message: 'Tenant not found' })
    }

    // Fetches all tenant data in parallel for faster loading
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
}
