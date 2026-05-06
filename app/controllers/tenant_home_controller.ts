import type { HttpContext } from '@adonisjs/core/http'
import weatherService from '#services/weather_service'
import newsService from '#services/news_service'
import WeatherLocation from '#models/weather_location'
import AppSetting from '#models/app_setting'
import Slide from '#models/slide'

export default class TenantHomeController {
  async index({ inertia, tenant }: HttpContext) {
    const tenantId = tenant!.id

    const [location, news, colors, slides] = await Promise.all([
      WeatherLocation.query().where('tenantId', tenantId).first(),
      newsService.get().catch(() => []),
      AppSetting.query().where('tenantId', tenantId).first(),
      Slide.query().where('tenantId', tenantId).where('isActive', true).orderBy('order', 'asc'),
    ])

    const weather = location
      ? await weatherService.get(location.latitude, location.longitude).catch(() => null)
      : null

    const formattedSlides = slides.map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      duration: s.duration,
      isActive: s.isActive,
      order: s.order,
      mediaName: s.media ? `/storage/${s.media}` : undefined,
      mediaType: s.mediaType,
    }))

    return inertia.render('home', {
      slug: tenant!.slug,
      weather,
      location: location ?? null,
      news,
      colors: colors ?? null,
      slides: formattedSlides,
    })
  }
}
