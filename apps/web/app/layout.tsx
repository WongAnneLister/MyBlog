import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google"
import "./styles/tokens.css"
import "./styles/base.css"
import "./styles/layout.css"
import "./styles/home.css"
import "./styles/projects.css"
import "./styles/post.css"
import "./styles/about.css"
import "./styles/markdown.css"
import "./admin/admin.css"
import "./admin/admin-layout.css"
import "./admin/avatar.css"
import "./admin/avatar-drag.css"
import "./admin/writer.css"
import "./admin/preview.css"
import "./admin/pins.css"
import "./admin/about-preview.css"
import "./admin/project-editor.css"
import "./admin/resume-editor.css"
import { getSite, normalizeSite, siteUrl } from "../lib/site-data"

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" })
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" })
const fontClass = [inter, newsreader, jetbrainsMono].map((font) => font.variable).join(" ")

// 中文字体不走 next/font：它会在构建时下载上百个 unicode-range 切片，
// VPS 上构建时只要一个切片下载失败整个部署就会失败。改为运行时引用样式表，
// 浏览器只按页面里实际出现的字下载对应切片。
const cjkFontsHref = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500&family=Noto+Serif+SC:wght@500;600&display=swap"

/** 首屏渲染前确定主题，避免刷新时闪白 / 闪黑。 */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`

export async function generateMetadata(): Promise<Metadata> {
  const site = normalizeSite(await getSite())
  const name = site.displayName || "Michikatsu"
  const intro = site.homeIntro?.trim()
  const description = intro || `Writing, projects and background from ${name}.`
  const title = `${name} · Personal site`
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s · ${name}` },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: name,
      locale: "en_US",
      url: "/",
      title,
      description,
      images: site.avatarUrl ? [{ url: site.avatarUrl, alt: name }] : undefined
    },
    twitter: { card: "summary", title, description, images: site.avatarUrl ? [site.avatarUrl] : undefined }
  }
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontClass} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={cjkFontsHref} />
      </head>
      <body>{children}</body>
    </html>
  )
}
