import { useForm } from '@inertiajs/react'
import { useState, useEffect, useRef } from 'react'
import useGeoSearch from '~/hooks/useGeoSearch'
import type { Location, GeoResult } from '~/types'

export default function MeteoSection({ location }: { location?: Location }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  // Custom hook fetches geolocation autocomplete results based on query; debounced for API efficiency
  const { results, loading } = useGeoSearch(query)

  const searchRef = useRef<HTMLDivElement>(null)
  // $attributes contains the actual database field values from the Lucid model
  const data = location?.$attributes

  // Inertia form handles submission with CSRF token and form state validation
  const form = useForm({
    name: location?.name ?? '',
    latitude: location?.latitude ?? '',
    longitude: location?.longitude ?? '',
  })

  // Formats location name from search result; filters out missing fields for clean display
  function selectResult(result: GeoResult) {
    const label = [result.name, result.admin1, result.country].filter(Boolean).join(', ')
    // Updates all form fields when user selects from autocomplete dropdown
    form.setData({ name: label, latitude: result.latitude, longitude: result.longitude })
    setQuery(label)
    setOpen(false)
  }

  // Click-outside handler closes autocomplete dropdown for standard dropdown UX
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    // Only listens when dropdown might be open; returns early otherwise
    document.addEventListener('mousedown', handleClick)
    // Cleanup prevents memory leaks from multiple listeners
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  
  function submit(e: React.FormEvent) {
    e.preventDefault()
    // Posts form data to /dashboard route where UpdateController stores the location
    form.post('/dashboard')
  }

  return (
    <section className="db-card">
      <h2>Localisation météo</h2>
      {/* Shows current location if configured; otherwise displays empty state */}
      {location ? (
        <p className="db-current">
          Actuellement : <strong>{data.name}</strong>
          {/* Displays coordinates with 4 decimal places (≈11m precision) for verification */}
          <span className="db-coords">{data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}</span>
        </p>
      ) : (
        <p className="db-empty">Aucune localisation configurée.</p>
      )}

      <form onSubmit={submit} className="db-form">
        {/* Search field with autocomplete dropdown; ref used for click-outside detection */}
        <div className="db-field" ref={searchRef}>
          <label htmlFor="search">Rechercher une ville</label>
          <input
            id="search"
            type="text"
            placeholder="Ex: Genève, Zurich, Lausanne…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
            // Opens dropdown when user focuses input; simplifies UX for returning users
            onFocus={() => setOpen(true)}
            // Disables browser autocomplete to prevent conflicts with custom dropdown
            autoComplete="off"
          />
          {/* Only renders dropdown when open and results exist; reduces DOM nodes */}
          {open && (results.length > 0 || loading) && (
            <ul className="db-suggestions">
              {loading && <li className="db-suggestion-loading">Recherche…</li>}
              {results.map((r) => (
                // onMouseDown used instead of onClick to allow selection before dropdown closes from blur
                <li key={r.id} className="db-suggestion" onMouseDown={() => selectResult(r)}>
                  <span className="db-suggestion-name">{r.name}</span>
                  {/* Shows region and country for disambiguation when multiple cities have same name */}
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
  )}