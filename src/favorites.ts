import Taro from '@tarojs/taro'
import { article, feedItems, hotTopics } from './data/content'

const FAVORITES_KEY = 'zhijian-favorites'

export interface FavoriteArticle {
  id: string
  title: string
  subtitle: string
  image?: string
}

function catalog() {
  const items = new Map<string, FavoriteArticle>()
  items.set(article.id, {
    id: article.id,
    title: article.title,
    subtitle: article.subtitle,
    image: article.image
  })
  for (const item of [...hotTopics, ...feedItems]) {
    if (items.has(item.id)) continue
    items.set(item.id, {
      id: item.id,
      title: item.title,
      subtitle: item.summary,
      image: item.image
    })
  }
  return items
}

export function readFavoriteIds() {
  try {
    const value = Taro.getStorageSync(FAVORITES_KEY)
    if (!Array.isArray(value)) return []
    return value.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

export function isFavorite(id: string) {
  return readFavoriteIds().includes(id)
}

export function toggleFavorite(id: string) {
  const current = readFavoriteIds()
  const saved = current.includes(id)
  const next = saved ? current.filter((item) => item !== id) : [id, ...current]
  Taro.setStorageSync(FAVORITES_KEY, next)
  return !saved
}

export function listFavoriteArticles() {
  const items = catalog()
  return readFavoriteIds().flatMap((id) => {
    const item = items.get(id)
    return item ? [item] : []
  })
}
