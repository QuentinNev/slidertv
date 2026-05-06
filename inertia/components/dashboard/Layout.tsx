import { useForm, usePage } from '@inertiajs/react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Data } from '@generated/data'
import type { DashboardSection, Slide } from '~/types'

const NAV_ITEMS: { id: DashboardSection; label: string }[] = [
  { id: 'colors', label: 'Palette de couleurs' },
  { id: 'meteo', label: 'Localisation météo' },
]

export default function Layout({
  section,
  setSection,
  children,
  slides = [],
  onSlideSelect,
  onCreateSlide,
  selectedSlideId,
}: {
  children: ReactNode
  section: DashboardSection
  setSection: (section: DashboardSection) => void
  slides?: Slide[]
  onSlideSelect?: (slide: Slide) => void
  onCreateSlide?: () => void
  selectedSlideId?: number
}) {
  const { props } = usePage<Data.SharedProps>()
  const user = props.user
  const logoutForm = useForm({})
  const [slideMenuOpen, setSlideMenuOpen] = useState(false)

  return (
    <div className="db-layout">
      <header className="db-header">
        <h1>Dashboard</h1>
        <div className="db-header-right">
          <a href="/" className="db-link">
            ← Retour à l'écran TV
          </a>
          {user && (
            <div className="db-user">
              <span className="db-user-name">{user.fullName ?? user.email}</span>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  logoutForm.post('/logout')
                }}
              >
                <button type="submit" className="db-logout">
                  Déconnexion
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      <div className="db-body">
        <nav className="db-sidebar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`db-nav-item${section === item.id ? ' active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              {item.label}
            </button>
          ))}

          <div className="db-nav-group">
            <button
              type="button"
              className={`db-nav-item db-nav-slides${section === 'slide' ? ' active' : ''}`}
              onClick={() => setSlideMenuOpen(!slideMenuOpen)}
            >
              Slides
              <div className={`db-chevron${slideMenuOpen ? ' open' : ''}`}>›</div>
            </button>

            {slideMenuOpen && (
              <div className="db-slides-menu">
                <button
                  type="button"
                  className="db-slide-item create"
                  onClick={() => {
                    onCreateSlide?.()
                    setSlideMenuOpen(false)
                  }}
                >
                  + Créer une slide
                </button>

                {slides.length > 0 && <div className="db-slides-divider" />}

                {slides.map((slide) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`db-slide-item${selectedSlideId === slide.id ? ' active' : ''}`}
                    onClick={() => {
                      onSlideSelect?.(slide)
                      setSlideMenuOpen(false)
                    }}
                  >
                    {slide.title || 'Sans titre'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <main className="db-content">{children}</main>
      </div>
    </div>
  )
}
