import type { Metadata } from "next"
import { ProjectsView } from "../../../components/projects-view"
import { SiteShell } from "../../../components/site-shell"
import { buildMetadata, getProjects, loadSite } from "../../../lib/site-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "Projects", description: "Projects with the problem behind them, the stack they run on and where to read the code.", path: "/projects" })
}

export default async function ProjectsPage() {
  const [projects, site] = await Promise.all([getProjects(), loadSite()])
  return (
    <SiteShell site={site} active="projects">
      <ProjectsView projects={projects ?? []} />
    </SiteShell>
  )
}
