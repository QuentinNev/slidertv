import WeatherWidget, { type WeatherData } from '~/components/WeatherWidget'
import DateTimeWidget from '~/components/DateTimeWidget'
import Slider from '~/components/Slider'
import NewsTicker, { type NewsItem } from '~/components/NewsTicker'

interface Location {
  name: string
  latitude: number
  longitude: number
}

export default function Home({
  weather,
  location,
  news,
}: {
  weather: WeatherData | null
  location: Location | null
  news: NewsItem[]
}) {
  return (
    <div className="tv-layout">
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
