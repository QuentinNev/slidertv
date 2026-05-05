const NEWS_ITEMS = [
  'Actualité 1 — Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  'Actualité 2 — Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  'Actualité 3 — Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
  'Actualité 4 — Duis aute irure dolor in reprehenderit in voluptate velit esse cillum',
]

export default function NewsTicker() {
  const text = NEWS_ITEMS.join('     ◆     ')
  return (
    <div className="tv-news-bar">
      <span className="tv-news-label">ACTU</span>
      <div className="tv-news-track">
        <span className="tv-news-text">{text + '     ◆     ' + text}</span>
      </div>
    </div>
  )
}
