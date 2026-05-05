import { useForm, usePage } from '@inertiajs/react'
import { useState, useEffect, useRef } from 'react'
import ColorSection from '~/components/dashboard/ColorSection'
import MeteoSection from '~/components/dashboard/MeteoSection'

import { Data } from '@generated/data'

type Section = 'colors' | 'meteo' | 'slide'

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'colors', label: 'Palette de couleurs' },
  { id: 'meteo', label: 'Localisation météo' },
  { id: 'slide', label: 'Slides'}
]

interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
}

interface Colors {
  backgroundColor: string | null
  accentColor: string | null
}

export default function Layout({
  section, setSection,
  children,
  location,
  colors,
}: {
  children: React.ReactNode
  location: Location | null
  colors: Colors | null
}) {
  const { props } = usePage<Data.SharedProps>()
  const user = props.user
  const logoutForm = useForm({})

  const data = location?.$attributes ?? location

  return (
    <div className="db-layout">
      <header className="db-header">
        <h1>Dashboard</h1>
        <div className="db-header-right">
          <a href="/" className="db-link">← Retour à l'écran TV</a>
          {user && (
            <div className="db-user">
              <span className="db-user-name">{user.fullName ?? user.email}</span>
              <form onSubmit={(e) => { e.preventDefault(); logoutForm.post('/logout') }}>
                <button type="submit" className="db-logout">Déconnexion</button>
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

        <main className="db-content">
          {children}
        </main>
      </div>
    </div>
  )
}
