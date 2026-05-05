import { useState, useEffect } from 'react'

function WeatherWidget() {
  return (
    <div className="tv-weather">
      <div className="tv-weather-icon">⛅</div>
      <div className="tv-weather-temp">22°C</div>
      <div className="tv-weather-desc">Partiellement nuageux</div>
      <div className="tv-weather-loc">Paris, France</div>
      <div className="tv-weather-details">
        <span>Humidité 65%</span>
        <span>Vent 12 km/h</span>
      </div>
    </div>
  )
}

function DateTimeWidget() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="tv-datetime">
      <div className="tv-datetime-time">
        {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="tv-datetime-date">
        {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  )
}

const SLIDES = [
  { id: 1, bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', title: 'Bienvenue' },
  { id: 2, bg: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)', title: 'SliderTV' },
  { id: 3, bg: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', title: 'Panneau 3' },
]

function Slider() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="tv-slider" style={{ background: SLIDES[idx].bg }}>
      <div className="tv-slider-title">{SLIDES[idx].title}</div>
      <div className="tv-slider-dots">
        {SLIDES.map((s, i) => (
          <button key={s.id} className={`tv-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  )
}

const NEWS_ITEMS = [
  'Actualité 1 — Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'Actualité 2 — Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  'Actualité 3 — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
  'Actualité 4 — Duis aute irure dolor in reprehenderit in voluptate velit esse cillum',
]

function NewsTicker() {
  const text = NEWS_ITEMS.join('     ◆     ')
  return (
    <div className="tv-news-bar">
      <span className="tv-news-label">ACTU</span>
      <div className="tv-news-track">
        <span className="tv-news-text">{text + '     ◆     ' + text}</span>
      </div>
    </div>
  )
}

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
