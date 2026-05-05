import WeatherWidget, { type WeatherData } from '~/components/WeatherWidget'
import DateTimeWidget from '~/components/DateTimeWidget'
import Slider from '~/components/Slider'
import NewsTicker from '~/components/NewsTicker'

export default function Home({ weather }: { weather: WeatherData | null }) {
  return (
    <div className="tv-layout">
      <aside className="tv-left">
        <WeatherWidget weather={weather} />
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
