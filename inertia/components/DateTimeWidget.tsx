import { useState, useEffect } from 'react'

export default function DateTimeWidget() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="tv-datetime">
      <div className="tv-datetime-time">
        {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div className="tv-datetime-date">
        {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  )
}
