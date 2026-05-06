import { useForm, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import type { Data } from '@generated/data'
import type { DashboardSection } from '~/types'

const NAV_ITEMS: { id: DashboardSection; label: string }[] = [
  { id: 'colors', label: 'Palette de couleurs' },
  { id: 'meteo', label: 'Localisation météo' },
  { id: 'slide', label: 'Slides' },
]

export default function Layout({
  section,
  setSection,
  children,
}: {
  children: ReactNode
  section: DashboardSection
  setSection: (section: DashboardSection) => void
}) {
  const { props } = usePage<Data.SharedProps>()
  const user = props.user
  const logoutForm = useForm({})

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
        </nav>

        <main className="db-content">{children}</main>
      </div>
    </div>
  )
}
