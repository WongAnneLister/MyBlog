import { HomeView } from "../../components/home-view"
import { SiteShell } from "../../components/site-shell"
import { loadShellData } from "../../lib/site-data"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const { posts, projects, site } = await loadShellData()
  return (
    <SiteShell site={site}>
      <HomeView site={site} posts={posts} projects={projects} />
    </SiteShell>
  )
}
