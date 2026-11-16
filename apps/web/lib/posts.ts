import type { Post, PostLang } from "./site-data"

export type ListedPost = Post & { languages: PostLang[] }

const langOf = (post: Post): PostLang => (post.lang === "zh" ? "zh" : "en")

/**
 * 同一 translation_key 的中英文版本在列表里只出现一条，优先英文版，
 * 并把这一组可用的语言挂到 languages 上，供标签旁标注 EN · 中文。
 */
export function groupByTranslation(posts: Post[], preferSlug?: string): ListedPost[] {
  const groups = new Map<string, Post[]>()
  const order: string[] = []

  posts.forEach((post, index) => {
    const key = post.translationKey?.trim() ? `key:${post.translationKey.trim()}` : `slug:${post.slug}:${index}`
    const group = groups.get(key)
    if (group) group.push(post)
    else { groups.set(key, [post]); order.push(key) }
  })

  return order.map((key) => {
    const group = groups.get(key) as Post[]
    const primary = (preferSlug && group.find((post) => post.slug === preferSlug)) || group.find((post) => langOf(post) === "en") || group[0]
    const languages: PostLang[] = []
    if (group.some((post) => langOf(post) === "en")) languages.push("en")
    if (group.some((post) => langOf(post) === "zh")) languages.push("zh")
    return { ...primary, languages }
  })
}

/** 只有英文不标；两种都有标 EN · 中文；只有中文标 中文。 */
export function languageLabel(languages: PostLang[]) {
  if (languages.length > 1) return "EN · 中文"
  return languages[0] === "zh" ? "中文" : null
}
