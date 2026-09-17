import type { Metadata } from "next"
import { SiteShell } from "../../../components/site-shell"
import { buildMetadata, loadShellData } from "../../../lib/site-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "博文", description: "全部已发布的文章，置顶内容优先展示。", path: "/posts" })
}

export default async function PostsPage() {
  return <SiteShell view="Blog" data={await loadShellData()} />
}
