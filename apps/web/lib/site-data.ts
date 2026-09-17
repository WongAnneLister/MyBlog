export type Post = { slug: string; title: string; excerpt: string; tags: string[]; pinned: boolean; date: string | null }
export type Project = { slug: string; title: string; description: string; content: string; coverUrl: string; tags: string[]; url: string }
export type ResumeItem = { organization: string; title: string; period: string; location: string; description: string }
export type Site = { displayName: string; handle: string; avatarUrl: string; homeIntro: string; aboutTitle: string; aboutContent: string; links: { label: string; url: string }[]; education: ResumeItem[]; workExperience: ResumeItem[] }

export { summarize, stripLeadingTitle } from "./text"

export const emptySite: Site = { displayName: "", handle: "", avatarUrl: "", homeIntro: "", aboutTitle: "", aboutContent: "", links: [], education: [], workExperience: [] }

/** 站点公开地址：用于 canonical、Open Graph 与 sitemap 的绝对链接。 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://blog.michikatsu.top").replace(/\/$/, "")
/** 服务端渲染时走容器内网地址，浏览器侧仍走 /api。 */
const serverApi = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8788"

async function get<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${serverApi}${path}`, { cache: "no-store" })
    return response.ok ? (await response.json() as T) : null
  } catch { return null }
}

export const getPosts = () => get<Post[]>("/posts")
export const getProjects = () => get<Project[]>("/projects")
export const getSite = () => get<Partial<Site>>("/site")

export function normalizeSite(value: Partial<Site> | null): Site {
  if (!value) return emptySite
  return {
    ...emptySite,
    ...value,
    links: Array.isArray(value.links) ? value.links : [],
    education: Array.isArray(value.education) ? value.education : [],
    workExperience: Array.isArray(value.workExperience) ? value.workExperience : []
  }
}

/** 首页 / 关于 / 项目 / 博文 四个视图共用的服务端数据加载。 */
export async function loadShellData() {
  const [posts, projects, site] = await Promise.all([getPosts(), getProjects(), getSite()])
  return { posts: posts ?? [], projects: projects ?? [], site: normalizeSite(site), loaded: posts !== null || projects !== null || site !== null }
}

/** 统一构造逐页 metadata：canonical + Open Graph + Twitter 卡片。 */
export async function buildMetadata(input: { title?: string; description: string; path: string; type?: "website" | "article" | "profile"; publishedTime?: string; tags?: string[]; image?: string }) {
  const site = normalizeSite(await getSite())
  const name = site.displayName || "Michikatsu"
  const title = input.title ? `${input.title}｜${name}` : `${name}｜个人网站`
  const cover = input.image || site.avatarUrl
  const images = cover ? [{ url: cover, alt: input.title || name }] : undefined
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      type: input.type ?? "website",
      siteName: `${name}｜个人网站`,
      locale: "zh_CN",
      url: input.path,
      title,
      description: input.description,
      images,
      ...(input.type === "article" ? { publishedTime: input.publishedTime, authors: [name], tags: input.tags } : {})
    },
    twitter: { card: input.image ? ("summary_large_image" as const) : ("summary" as const), title, description: input.description, images: cover ? [cover] : undefined }
  }
}
