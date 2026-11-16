import type { Metadata } from "next"
import { PostList } from "../../../components/post-list"
import { SiteShell } from "../../../components/site-shell"
import { groupByTranslation } from "../../../lib/posts"
import { buildMetadata, loadShellData } from "../../../lib/site-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "Writing", description: "Notes on agent reliability, retrieval, LLM gateways and backend work.", path: "/posts" })
}

export default async function PostsPage() {
  const { posts, site } = await loadShellData()
  return (
    <SiteShell site={site} active="writing">
      <div className="page-head">
        <h1>Writing</h1>
        <p>Notes on agent reliability, retrieval, LLM gateways and the backend work underneath.</p>
      </div>
      <PostList posts={groupByTranslation(posts)} empty="No posts published yet." />
    </SiteShell>
  )
}
