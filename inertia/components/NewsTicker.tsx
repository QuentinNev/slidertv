export interface NewsItem {
  title: string
}

export default function NewsTicker({ news }: { news: NewsItem[] }) {
  // Don't render if no news; prevents empty ticker from taking up space
  if (news.length === 0) return null

  // Joins titles with diamond separator; creates horizontal scrolling text
  const text = news.map((n) => n.title).join('     ◆     ')

  return (
    <div className="tv-news-bar">
      <span className="tv-news-label">ACTU</span>
      <div className="tv-news-track">
        {/* Duplicates the news text to create seamless infinite scroll loop when CSS animation reaches the end */}
        <span className="tv-news-text">{text + '     ◆     ' + text}</span>
      </div>
    </div>
  )
}
