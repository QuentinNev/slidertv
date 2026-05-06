import { useState, useEffect } from 'react'
import type { Slide } from '~/types'

const FALLBACK_SLIDES = [
  { id: 1, title: 'Bienvenue', content: '', duration: 6 },
  { id: 2, title: 'SliderTV', content: '', duration: 6 },
  { id: 3, title: 'Panneau 3', content: '', duration: 6 },
]

export default function Slider({ slides = [] }: { slides?: Slide[] }) {
  const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (displaySlides.length === 0) return

    const currentSlide = displaySlides[idx]
    const duration = currentSlide.duration || 6
    const t = setInterval(() => setIdx((i) => (i + 1) % displaySlides.length), duration * 1000)
    return () => clearInterval(t)
  }, [idx, displaySlides])

  if (displaySlides.length === 0) {
    return (
      <div className="tv-slider" style={{ background: 'var(--tv-bg)' }}>
        <div className="tv-slider-title">Pas de slides disponibles</div>
      </div>
    )
  }

  const slide = displaySlides[idx]

  return (
    <div className="tv-slider" style={{ background: 'var(--tv-bg)' }}>
      <div className="tv-slider-title">{slide.title}</div>
      {slide.content && <div className="tv-slider-content">{slide.content}</div>}
      <div className="tv-slider-dots">
        {displaySlides.map((_, i) => (
          <button key={i} className={`tv-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  )
}
