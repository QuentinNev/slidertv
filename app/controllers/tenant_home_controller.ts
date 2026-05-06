import type { HttpContext } from '@adonisjs/core/http'
import weatherService from '#services/weather_service'
import newsService from '#services/news_service'
import WeatherLocation from '#models/weather_location'
import AppSetting from '#models/app_setting'
import Slide from '#models/slide'

export default class TenantHomeController {
  async index({ inertia, tenant }: HttpContext) {
    const tenantId = tenant!.id

    // Fetches location, news, settings, and slides in parallel; catches errors gracefully for non-critical services
    const [location, news, colors, slides] = await Promise.all([
      WeatherLocation.query().where('tenantId', tenantId).first(),
      // News service errors don't block the page; defaults to empty array if fetch fails (e.g., API down)
      newsService.get().catch(() => []),
      AppSetting.query().where('tenantId', tenantId).first(),
      // Only fetches active slides sorted by display order; inactive slides remain in database for future use
      Slide.query().where('tenantId', tenantId).where('isActive', true).orderBy('order', 'asc'),
    ])

    // Weather API call deferred until we know a location exists; avoids unnecessary API call for unconfigured tenants
    const weather = location
      ? await weatherService.get(location.latitude, location.longitude).catch(() => null)
      : null

    // Transforms database model to client-safe format; converts stored key to public URL for media access
    const formattedSlides = slides.map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      duration: s.duration,
      isActive: s.isActive,
      order: s.order,
      // Prepends /storage/ prefix to allow browser to fetch from public disk
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
