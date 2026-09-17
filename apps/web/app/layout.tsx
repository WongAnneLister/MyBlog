import type { Metadata } from "next"
import "./globals.css"
import "./functional.css"
import "./categories.css"
import "./sidebar-compact.css"
import "./sidebar-clean.css"
import "./markdown.css"
import "./code.css"
import "./reader.css"
import "./feed.css"
import "./about.css"
import "./about-resume.css"
import "./resume.css"
import "./empty-state.css"
import "./admin/admin.css"
import "./admin/admin-layout.css"
import "./admin/avatar.css"
import "./admin/avatar-drag.css"
import "./admin/writer.css"
import "./admin/preview.css"
import "./admin/pins.css"
import "./mobile.css"
import "./responsive-fixes.css"
import "./desktop-layout.css"
import "./project-detail.css"
import "./about-editor.css"
import "./admin/project-editor.css"
import "./admin/resume-editor.css"
import { getSite, normalizeSite, siteUrl } from "../lib/site-data"

export async function generateMetadata(): Promise<Metadata> {
  const site = normalizeSite(await getSite())
  const name = site.displayName || "Michikatsu"
  const intro = site.homeIntro?.trim().replace(/\s*×\s*/g, " · ")
  const description = intro ? `${intro}。${name} 的文章、项目与个人介绍。` : `${name} 的文章、项目与个人介绍`
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${name}｜个人网站`, template: `%s｜${name}` },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: `${name}｜个人网站`,
      locale: "zh_CN",
      url: "/",
      title: `${name}｜个人网站`,
      description,
      images: site.avatarUrl ? [{ url: site.avatarUrl, alt: name }] : undefined
    },
    twitter: { card: "summary", title: `${name}｜个人网站`, description, images: site.avatarUrl ? [site.avatarUrl] : undefined }
  }
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
