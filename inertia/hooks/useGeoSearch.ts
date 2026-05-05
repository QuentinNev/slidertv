import {useState,useEffect} from 'react'

export default function useGeoSearch(query: string) {
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