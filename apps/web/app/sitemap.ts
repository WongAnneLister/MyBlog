import type { MetadataRoute } from "next"
import { getPosts, getProjects, siteUrl } from "../lib/site-data"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()])
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/posts`, lastModified: now, changeFrequency: "daily", priority: 0.8 }
  ]
  return [
    ...staticRoutes,
    ...(posts ?? []).map((post) => ({ url: `${siteUrl}/posts/${post.slug}`, lastModified: post.date ? new Date(post.date) : now, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...(projects ?? []).map((project) => ({ url: `${siteUrl}/projects/${project.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }))
  ]
}
