import { useState, useEffect } from 'react'

export default function DateTimeWidget() {
  const [now, setNow] = useState(new Date())
  // Updates time every second; interval is cleaned up on unmount to prevent memory leaks
  useEffect(() => {
    // Updates trigger a re-render which displays the new time/date on TV screen in real-time
    const t = setInterval(() => setNow(new Date()), 1000)
    // Cleanup function stops the interval when component unmounts; prevents running timers in background
    return () => clearInterval(t)
  }, [])
  return (
    <div className="tv-datetime">
      {/* Time formatted with French locale; displays as HH:MM:SS format */}
      <div className="tv-datetime-time">
        {now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      {/* Date formatted with French locale; displays weekday name and full date */}
      <div className="tv-datetime-date">
        {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  )
}
