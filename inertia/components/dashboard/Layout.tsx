import { useForm, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Data } from '@generated/data'
import type { DashboardSection, Slide } from '~/types'
import SortableSlideList from './SortableSlideList'

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
  tenantSlug,
}: {
  children: ReactNode
  section: DashboardSection
  setSection: (section: DashboardSection) => void
  slides?: Slide[]
  onSlideSelect?: (slide: Slide) => void
  onCreateSlide?: () => void
  selectedSlideId?: number
  tenantSlug?: string
}) {
  const { props } = usePage<Data.SharedProps>()
  const user = props.user
  // useForm provides form submission with CSRF protection for logout action
  const logoutForm = useForm({})
  // Controls whether the slides submenu is expanded; initializes to true if currently viewing slides
  const [slideMenuOpen, setSlideMenuOpen] = useState(section === 'slide')

  // Auto-expands slides menu when user navigates to slide section, ensuring menu is visible
  useEffect(() => {
    if (section === 'slide') {
      setSlideMenuOpen(true)
    }
  }, [section])

  return (
    <div className="db-layout">
      <header className="db-header">
        <h1>Dashboard</h1>
        <div className="db-header-right">
          {/* Back link to TV display is only shown if tenant slug is available (multi-tenant context) */}
          {tenantSlug && (
            <a href={`/${tenantSlug}`} className="db-link">
              ← Retour à l'écran TV
            </a>
          )}
          {user && (
            <div className="db-user">
              {/* Shows full name if available; falls back to email for display */}
              <span className="db-user-name">{user.fullName ?? user.email}</span>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  // Inertia form submission triggers POST to /logout route with CSRF token
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
          {/* Main navigation buttons: colors and weather sections */}
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

          {/* Collapsible slides menu with submenu items */}
          <div className="db-nav-group">
            <button
              type="button"
              className={`db-nav-item db-nav-slides${section === 'slide' ? ' active' : ''}`}
              // Toggles submenu expansion; doesn't change active section when clicked
              onClick={() => setSlideMenuOpen(!slideMenuOpen)}
            >
              Slides
              {/* Chevron rotates when menu is open to indicate expanded state */}
              <div className={`db-chevron${slideMenuOpen ? ' open' : ''}`}>›</div>
            </button>

            {/* Slides submenu appears only when slideMenuOpen is true; reduces clutter in narrow UI */}
            <div className={`db-slides-menu${slideMenuOpen ? ' open' : ''}`}>
              <button
                type="button"
                className="db-slide-item create"
                onClick={() => onCreateSlide?.()}
              >
                + Créer une slide
              </button>

              {/* Divider only shown if there are existing slides to separate create button from list */}
              {slides.length > 0 && <div className="db-slides-divider" />}

              {/* Lists all slides with drag-and-drop reordering support */}
              <SortableSlideList
                slides={slides}
                selectedSlideId={selectedSlideId}
                onSlideSelect={onSlideSelect}
              />
            </div>
          </div>
        </nav>

        <main className="db-content">{children}</main>
      </div>
    </div>
  )
}
