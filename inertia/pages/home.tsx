import WeatherWidget, { type WeatherData } from '~/components/WeatherWidget'
import DateTimeWidget from '~/components/DateTimeWidget'
import Slider from '~/components/Slider'
import NewsTicker, { type NewsItem } from '~/components/NewsTicker'

interface Location {
  name: string
  latitude: number
  longitude: number
}

interface Colors {
  backgroundColor: string | null
  accentColor: string | null
}

export default function Home({
  weather,
  location,
  news,
  colors,
}: {
  weather: WeatherData | null
  location: Location | null
  news: NewsItem[]
  colors: Colors | null
}) {
  const style = {
    '--tv-bg': colors?.$attributes.backgroundColor ?? '#0d0d14',
    '--tv-accent': colors?.$attributes.accentColor ?? '#e53e3e',
  } as React.CSSProperties

  return (
    <div className="tv-layout" style={style}>
      <aside className="tv-left">
        <WeatherWidget weather={weather} locationName={location?.name ?? null} />
        <DateTimeWidget />
      </aside>
      <section className="tv-main">
        <Slider />
      </section>
      <footer className="tv-footer">
        <NewsTicker news={news} />
      </footer>
    </div>
  )
}
