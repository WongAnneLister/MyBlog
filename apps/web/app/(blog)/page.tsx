import { SiteShell } from "../../components/site-shell"
import { loadShellData } from "../../lib/site-data"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  return <SiteShell view="Home" data={await loadShellData()} />
}
