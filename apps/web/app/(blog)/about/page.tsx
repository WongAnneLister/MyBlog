import type { Metadata } from "next"
import { AboutView } from "../../../components/about-view"
import { SiteShell } from "../../../components/site-shell"
import { buildMetadata, loadSite, summarize } from "../../../lib/site-data"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const site = await loadSite()
  const name = site.displayName || "Michikatsu"
  return buildMetadata({
    title: site.aboutTitle || "About",
    description: site.aboutContent ? summarize(site.aboutContent) : `About ${name}: background, education and work experience.`,
    path: "/about",
    type: "profile"
  })
}

export default async function AboutPage() {
  const site = await loadSite()
  return (
    <SiteShell site={site} active="about">
      <AboutView site={site} />
    </SiteShell>
  )
}
