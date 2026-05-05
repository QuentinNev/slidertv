import WeatherWidget from '~/components/WeatherWidget'
import DateTimeWidget from '~/components/DateTimeWidget'
import Slider from '~/components/Slider'
import NewsTicker from '~/components/NewsTicker'

export default function Home() {
  return (
    <div className="tv-layout">
      <aside className="tv-left">
        <WeatherWidget />
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
