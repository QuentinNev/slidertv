const FEED_URL = 'https://www.letemps.ch/cyber.rss'
const TTL_MS = 15 * 60 * 1000

export interface NewsItem {
  title: string
}

interface CacheEntry {
  items: NewsItem[]
  timestamp: number
}

function parseItems(xml: string): NewsItem[] {
  const items: NewsItem[] = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  const titleRe = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/

  let m: RegExpExecArray | null
  while ((m = itemRe.exec(xml)) !== null) {
    const t = titleRe.exec(m[1])
    if (t) items.push({ title: t[1].trim() })
  }
  return items
}

class NewsService {
  #cache: CacheEntry | null = null

  async get(): Promise<NewsItem[]> {
    if (this.#cache && Date.now() - this.#cache.timestamp < TTL_MS) {
      return this.#cache.items
    }
    const items = await this.#fetch()
    this.#cache = { items, timestamp: Date.now() }
    return items
  }

  async #fetch(): Promise<NewsItem[]> {
    const res = await fetch(FEED_URL)
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
    return parseItems(await res.text())
  }
}

export default new NewsService()
