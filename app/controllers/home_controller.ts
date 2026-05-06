import type { HttpContext } from '@adonisjs/core/http'
import weatherService from '#services/weather_service'
import newsService from '#services/news_service'
import WeatherLocation from '#models/weather_location'
import AppSetting from '#models/app_setting'
import Slide from '#models/slide'

export default class HomeController {
  async index({ inertia }: HttpContext) {
    // Default home page for non-tenant-specific access; fetches first available data (legacy single-tenant support)
    // TenantHomeController provides tenant-isolated version via /:slug route
    const [location, news, colors, slides] = await Promise.all([
      WeatherLocation.first(),
      // News service error is non-critical; empty array allows page to render even if news API is unavailable
      newsService.get().catch(() => []),
      AppSetting.first(),
      Slide.query().where('isActive', true).orderBy('order', 'asc'),
    ])

    // Defers weather API call until location exists; prevents unnecessary calls for unconfigured systems
    const weather = location
      ? await weatherService.get(location.latitude, location.longitude).catch(() => null)
      : null

    // Transforms database models to client-safe format; converts internal storage key to public URL
    const formattedSlides = slides.map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      duration: s.duration,
      isActive: s.isActive,
      order: s.order,
      // Prepends /storage/ prefix so browser can fetch media from public disk
      mediaName: s.media ? `/storage/${s.media}` : undefined,
      mediaType: s.mediaType,
    }))

    return inertia.render('home', {
      weather,
      location: location ?? null,
      news,
      colors: colors ?? null,
      slides: formattedSlides,
    })
  }
}
