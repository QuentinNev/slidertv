import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import WeatherWidget, { type WeatherData } from '~/components/WeatherWidget'
import DateTimeWidget from '~/components/DateTimeWidget'
import Slider from '~/components/Slider'
import NewsTicker, { type NewsItem } from '~/components/NewsTicker'
import type { Slide } from '~/types'

interface Location {
  name: string
  latitude: number
  longitude: number
}

interface Colors {
  backgroundColor: string | null
  accentColor: string | null
  textColor: string | null
}

export default function Home({
  slug,
  weather,
  location,
  news,
  colors,
  slides = [],
}: {
  slug: string
  weather: WeatherData | null
  location: Location | null
  news: NewsItem[]
  colors: Colors | null
  slides?: Slide[]
}) {
  useEffect(() => {
    const es = new EventSource(`/${slug}/events`)
    es.onmessage = () => router.reload({ only: ['colors', 'location', 'weather', 'news', 'slides'] })
    return () => es.close()
  }, [slug])

  const style = {
    '--tv-bg': colors?.$attributes.backgroundColor ?? '#0d0d14',
    '--tv-accent': colors?.$attributes.accentColor ?? '#e53e3e',
    '--tv-text': colors?.$attributes.textColor ?? '#ffffff',
  } as React.CSSProperties

  return (
    <div className="tv-layout" style={style}>
      <aside className="tv-left">
        <WeatherWidget weather={weather} locationName={location?.name ?? null} />
        <DateTimeWidget />
      </aside>
      <section className="tv-main">
        <Slider slides={slides} />
      </section>
      <footer className="tv-footer">
        <NewsTicker news={news} />
      </footer>
    </div>
  )
}
