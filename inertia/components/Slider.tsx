import { useState, useEffect } from 'react'
import type { Slide } from '~/types'

// Default slide shown if no slides exist (e.g., first load of empty tenant)
const FALLBACK_SLIDES: Slide[] = [
  {
    id: -1,
    title: 'Welcome',
    content: '',
    duration: 6,
    order: -1,
    isActive: true,
  },
]

export default function Slider({ slides = [] }: { slides?: Slide[] }) {
  const displaySlides = slides.length > 0 ? slides : FALLBACK_SLIDES
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (displaySlides.length === 0) return

    const currentSlide = displaySlides[idx]
    // Each slide can have its own duration; defaults to 6 seconds
    const duration = currentSlide.duration || 6
    // Recreates interval on each slide change to respect its specific duration
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
      {slide.mediaName && (
        <>
          {slide.mediaType?.startsWith('image/') && (
            <img src={slide.mediaName} alt={slide.title} className="tv-slider-media tv-slider-image" />
          )}
          {slide.mediaType?.startsWith('video/') && (
            <video src={slide.mediaName} autoPlay loop muted className="tv-slider-media tv-slider-video" />
          )}
        </>
      )}

      <div className="tv-slider-overlay">
        <div className="tv-slider-title" style={{ color: slide.titleColor ?? 'rgba(255, 255, 255, 0.9)' }}>
          {slide.title}
        </div>
        {slide.content && (
          <div className="tv-slider-content" style={{ color: slide.contentColor ?? 'rgba(255, 255, 255, 0.7)' }}>
            {slide.content}
          </div>
        )}
      </div>

      <div className="tv-slider-dots">
        {displaySlides.map((_, i) => (
          <button key={i} className={`tv-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  )
}
