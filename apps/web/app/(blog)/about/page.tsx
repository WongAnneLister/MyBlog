import type { Metadata } from "next"
import { SiteShell } from "../../../components/site-shell"
import { buildMetadata, getSite, loadShellData, normalizeSite, summarize } from "../../../lib/site-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const site = normalizeSite(await getSite())
  const name = site.displayName || "Michikatsu"
  return buildMetadata({
    title: site.aboutTitle || "关于",
    description: site.aboutContent ? summarize(site.aboutContent) : `${name} 的个人介绍、教育经历与工作经历。`,
    path: "/about",
    type: "profile"
  })
}

export default async function AboutPage() {
  return <SiteShell view="About" data={await loadShellData()} />
}
