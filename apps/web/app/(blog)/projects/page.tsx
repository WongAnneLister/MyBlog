import type { Metadata } from "next"
import { SiteShell } from "../../../components/site-shell"
import { buildMetadata, loadShellData } from "../../../lib/site-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "项目", description: "项目背景、技术方案与成果展示，每个项目都有独立的完整记录。", path: "/projects" })
}

export default async function ProjectsPage() {
  return <SiteShell view="Projects" data={await loadShellData()} />
}
