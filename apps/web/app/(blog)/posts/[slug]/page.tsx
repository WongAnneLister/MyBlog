import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PostReader, type PostLink, type Translation } from "../../../../components/post-reader"
import { SiteShell } from "../../../../components/site-shell"
import { groupByTranslation } from "../../../../lib/posts"
import { buildMetadata, getPosts, loadSite, summarize, type Post as PostSummary, type PostLang } from "../../../../lib/site-data"

export const dynamic = "force-dynamic"

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8788"
type Post = { title: string; slug: string; excerpt: string; date: string; tags: string[]; minutes: number; body: string; lang?: PostLang; translations?: Translation[] }

async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API}/posts/${slug}`, { cache: "no-store" })
    return response.ok ? response.json() : null
  } catch { return null }
}

/**
 * 列表按「置顶优先、时间倒序」返回，这里按时间重排后再取前后篇。
 * 同一篇文章的译本不算相邻文章：先按 translation_key 去重，当前这篇留在组里。
 */
function neighbours(list: PostSummary[], slug: string) {
  const ordered = groupByTranslation(list, slug).sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
  const index = ordered.findIndex((item) => item.slug === slug)
  if (index < 0) return { newer: null, older: null }
  const toLink = (item?: PostSummary): PostLink => item ? { slug: item.slug, title: item.title } : null
  return { newer: toLink(ordered[index - 1]), older: toLink(ordered[index + 1]) }
}

/** hreflang：自己 + 同一 translation_key 下的其它语言版本。 */
function languageAlternates(post: Post) {
  const versions: Translation[] = [{ lang: post.lang === "zh" ? "zh" : "en", slug: post.slug }, ...(post.translations ?? [])]
  if (versions.length < 2) return undefined
  return Object.fromEntries(versions.map((version) => [version.lang === "zh" ? "zh-CN" : "en", `/posts/${version.slug}`]))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } }
  return buildMetadata({
    title: post.title,
    description: post.excerpt?.trim() || summarize(post.body),
    path: `/posts/${slug}`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
    languages: languageAlternates(post)
  })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, list, site] = await Promise.all([getPost(slug), getPosts(), loadSite()])
  if (!post) notFound()
  const { newer, older } = neighbours(list ?? [], slug)
  return (
    <SiteShell site={site} active="writing">
      <PostReader post={post} newer={newer} older={older} />
    </SiteShell>
  )
}
