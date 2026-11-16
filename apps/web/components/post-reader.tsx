import Link from "next/link"
import { Markdown } from "./markdown"
import { formatDate, readingTime } from "../lib/format"
import { stripLeadingTitle } from "../lib/text"
import type { PostLang } from "../lib/site-data"

export type PostLink = { slug: string; title: string } | null
export type Translation = { lang: PostLang; slug: string }
type Post = { title: string; slug: string; date: string; tags: string[]; minutes: number; body: string; lang?: PostLang; translations?: Translation[] }

const langLabels: Record<PostLang, string> = { en: "English", zh: "中文" }
const htmlLang: Record<PostLang, string> = { en: "en", zh: "zh-CN" }

export function PostReader({ post, newer = null, older = null }: { post: Post; newer?: PostLink; older?: PostLink }) {
  const lang: PostLang = post.lang === "zh" ? "zh" : "en"
  // 正文里若又写了一遍一级标题，去掉它：一篇文章只保留一个 h1。
  const body = stripLeadingTitle(post.body, post.title)
  const versions: Translation[] = [{ lang, slug: post.slug }, ...(post.translations ?? [])]
    .filter((item, index, all) => all.findIndex((other) => other.lang === item.lang) === index)
    .sort((a, b) => (a.lang === "en" ? -1 : b.lang === "en" ? 1 : 0))
  const meta = [formatDate(post.date), readingTime(post.minutes), ...(post.tags.length ? [post.tags.join(" · ")] : [])].filter(Boolean)

  return (
    <article className="article">
      <Link className="article-back" href="/posts">← All writing</Link>
      <h1 lang={htmlLang[lang]}>{post.title}</h1>

      <div className="article-head">
        <div className="article-meta">{meta.join(" · ")}</div>
        {versions.length > 1 && (
          <div className="lang-switch" role="group" aria-label="Article language">
            {versions.map((version) => version.slug === post.slug ? (
              <a key={version.lang} href={`/posts/${version.slug}`} aria-current="true" lang={htmlLang[version.lang]}>{langLabels[version.lang]}</a>
            ) : (
              <Link key={version.lang} href={`/posts/${version.slug}`} lang={htmlLang[version.lang]} hrefLang={htmlLang[version.lang]}>{langLabels[version.lang]}</Link>
            ))}
          </div>
        )}
      </div>

      <div lang={htmlLang[lang]}>
        <Markdown content={body} />
      </div>

      {(newer || older) && (
        <nav className="post-nav" aria-label="Previous and next posts">
          {newer ? (
            <Link className="post-nav-item" href={`/posts/${newer.slug}`}><span>← Previous</span><b>{newer.title}</b></Link>
          ) : (
            <div className="post-nav-item"><span>← Previous</span><b>Nothing older.</b></div>
          )}
          {older ? (
            <Link className="post-nav-item next" href={`/posts/${older.slug}`}><span>Next →</span><b>{older.title}</b></Link>
          ) : (
            <div className="post-nav-item next"><span>Next →</span><b>Nothing yet. Stay tuned.</b></div>
          )}
        </nav>
      )}
    </article>
  )
}
