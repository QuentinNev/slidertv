import WeatherWidget, { type WeatherData } from '~/components/WeatherWidget'
import DateTimeWidget from '~/components/DateTimeWidget'
import Slider from '~/components/Slider'
import NewsTicker from '~/components/NewsTicker'

interface Location {
  name: string
  latitude: number
  longitude: number
}

export default function Home({
  weather,
  location,
}: {
  weather: WeatherData | null
  location: Location | null
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
        <NewsTicker />
      </footer>
    </div>
  )
}
