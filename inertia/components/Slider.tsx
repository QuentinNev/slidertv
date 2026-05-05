import { useState, useEffect } from 'react'

const SLIDES = [
  { id: 1, bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', title: 'Bienvenue' },
  { id: 2, bg: 'linear-gradient(135deg, #0f3460 0%, #533483 100%)', title: 'SliderTV' },
  { id: 3, bg: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', title: 'Panneau 3' },
]

export default function Slider() {
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
