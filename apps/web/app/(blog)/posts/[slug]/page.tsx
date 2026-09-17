import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PostReader } from "../../../../components/post-reader"
import { buildMetadata, getPosts, summarize, type Post as PostSummary } from "../../../../lib/site-data"

export const dynamic = "force-dynamic"

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8788"
type Post = { title: string; slug: string; excerpt: string; date: string; tags: string[]; minutes: number; body: string }
export type PostLink = { slug: string; title: string }

async function getPost(slug: string): Promise<Post | null> {
  try {
    const response = await fetch(`${API}/posts/${slug}`, { cache: "no-store" })
    return response.ok ? response.json() : null
  } catch { return null }
}

/** 列表按「置顶优先、时间倒序」返回，这里按时间重排后再取前后篇。 */
function neighbours(list: PostSummary[], slug: string) {
  const ordered = [...list].sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
  const index = ordered.findIndex((item) => item.slug === slug)
  if (index < 0) return { newer: null, older: null }
  const toLink = (item?: PostSummary): PostLink | null => item ? { slug: item.slug, title: item.title } : null
  return { newer: toLink(ordered[index - 1]), older: toLink(ordered[index + 1]) }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "文章不存在", robots: { index: false, follow: false } }
  return buildMetadata({
    title: post.title,
    description: post.excerpt?.trim() || summarize(post.body),
    path: `/posts/${slug}`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags
  })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, list] = await Promise.all([getPost(slug), getPosts()])
  if (!post) notFound()
  const { newer, older } = neighbours(list ?? [], slug)
  return <PostReader post={post} newer={newer} older={older} />
}
