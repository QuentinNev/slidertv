import { useForm } from '@inertiajs/react'
import { useState, useEffect, useRef } from 'react'

interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
}

interface GeoResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}

function useGeoSearch(query: string) {
  const [results, setResults] = useState<GeoResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=fr&format=json`
        const res = await fetch(url, { signal: controller.signal })
        const json = await res.json()
        setResults(json.results ?? [])
      } catch {
        // aborted or network error
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return { results, loading }
}

export default function Dashboard({ location }: { location: Location | null }) {
  const data = location.$attributes;
  const form = useForm({
    name: location?.name ?? '',
    latitude: location?.latitude ?? '',
    longitude: location?.longitude ?? '',
  })

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { results, loading } = useGeoSearch(query)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectResult(result: GeoResult) {
    const label = [result.name, result.admin1, result.country].filter(Boolean).join(', ')
    form.setData({
      name: label,
      latitude: result.latitude,
      longitude: result.longitude,
    })
    setQuery(label)
    setOpen(false)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    form.post('/dashboard')
  }

  return (
    <div className="db-layout">
      <header className="db-header">
        <h1>Dashboard</h1>
        <a href="/" className="db-link">← Retour à l'écran TV</a>
      </header>

      <main className="db-main">
        <section className="db-card">
          <h2>Palette de couleur</h2>
        </section>
        <section className="db-card">
          <h2>Localisation météo</h2>
          {location ? (
            <p className="db-current">
              Actuellement : <strong>{data.name}</strong>
              <span className="db-coords">{data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}</span>
            </p>
          ) : (
            <p className="db-empty">Aucune localisation configurée.</p>
          )}

          <form onSubmit={submit} className="db-form">
            <div className="db-field" ref={searchRef}>
              <label htmlFor="search">Rechercher une ville</label>
              <input
                id="search"
                type="text"
                placeholder="Ex: Genève, Zurich, Lausanne…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
                onFocus={() => setOpen(true)}
                autoComplete="off"
              />
              {open && (results.length > 0 || loading) && (
                <ul className="db-suggestions">
                  {loading && <li className="db-suggestion-loading">Recherche…</li>}
                  {results.map((r) => (
                    <li key={r.id} className="db-suggestion" onMouseDown={() => selectResult(r)}>
                      <span className="db-suggestion-name">{r.name}</span>
                      <span className="db-suggestion-meta">{[r.admin1, r.country].filter(Boolean).join(', ')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="db-coords-fields">
              <div className="db-field">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  value={form.data.latitude}
                  onChange={(e) => form.setData('latitude', e.target.value)}
                  data-invalid={form.errors.latitude ? 'true' : undefined}
                />
                {form.errors.latitude && <div>{form.errors.latitude}</div>}
              </div>
              <div className="db-field">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  value={form.data.longitude}
                  onChange={(e) => form.setData('longitude', e.target.value)}
                  data-invalid={form.errors.longitude ? 'true' : undefined}
                />
                {form.errors.longitude && <div>{form.errors.longitude}</div>}
              </div>
            </div>

            <div className="db-field">
              <label htmlFor="name">Nom affiché</label>
              <input
                id="name"
                type="text"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
                data-invalid={form.errors.name ? 'true' : undefined}
              />
              {form.errors.name && <div>{form.errors.name}</div>}
            </div>

            <button type="submit" disabled={form.processing} className="db-submit">
              {form.processing ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
