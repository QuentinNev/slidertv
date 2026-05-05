export interface NewsItem {
  title: string
}

export default function NewsTicker({ news }: { news: NewsItem[] }) {
  if (news.length === 0) return null

  const text = news.map((n) => n.title).join('     ◆     ')

  return (
    <div className="tv-news-bar">
      <span className="tv-news-label">ACTU</span>
      <div className="tv-news-track">
        <span className="tv-news-text">{text + '     ◆     ' + text}</span>
      </div>
    </div>
  )
}
