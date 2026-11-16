import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectReader } from "../../../../components/project-reader"
import { SiteShell } from "../../../../components/site-shell"
import { buildMetadata, loadSite, summarize } from "../../../../lib/site-data"

export const dynamic = "force-dynamic"

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8788"
type Project = { title: string; description: string; content: string; coverUrl: string; tags: string[]; url: string }

async function getProject(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(`${API}/projects/${slug}`, { cache: "no-store" })
    return response.ok ? response.json() : null
  } catch { return null }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: "Project not found", robots: { index: false, follow: false } }
  return buildMetadata({
    title: project.title,
    description: project.description?.trim() || summarize(project.content || ""),
    path: `/projects/${slug}`,
    type: "article",
    tags: project.tags,
    image: project.coverUrl || undefined
  })
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, site] = await Promise.all([getProject(slug), loadSite()])
  if (!project) notFound()
  return (
    <SiteShell site={site} active="projects">
      <ProjectReader project={project} />
    </SiteShell>
  )
}
