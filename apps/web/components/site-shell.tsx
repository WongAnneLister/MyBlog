import type { ReactNode } from "react"
import { SiteFooter } from "./site-footer"
import { SiteHeader, type NavKey } from "./site-header"
import type { Site } from "../lib/site-data"

/** 公开页面共用的外壳：顶部导航 + 居中单栏内容 + 页脚。 */
export function SiteShell({ site, active = null, children }: { site: Site; active?: NavKey; children: ReactNode }) {
  return (
    <div className="shell">
      <div className="shell-inner">
        <SiteHeader name={site.displayName || "Michikatsu"} active={active} />
      </div>
      <main className="site-main">
        <div className="shell-inner">{children}</div>
      </main>
      <div className="shell-inner">
        <SiteFooter site={site} />
      </div>
    </div>
  )
}
