"use client"

import Link from "next/link"
import { CSSProperties, useEffect, useState } from "react"
import { Markdown } from "../../components/markdown"

const api = process.env.NEXT_PUBLIC_API_URL || "/api"
type Post = { slug: string; title: string; excerpt: string; tags: string[]; pinned: boolean; date: string | null }
type Project = { slug: string; title: string; description: string; content: string; coverUrl: string; tags: string[]; url: string }
type ResumeItem = { organization: string; title: string; period: string; location: string; description: string }
type Site = { displayName: string; handle: string; avatarUrl: string; homeIntro: string; aboutTitle: string; aboutContent: string; links: { label: string; url: string }[]; education: ResumeItem[]; workExperience: ResumeItem[] }
const emptySite: Site = { displayName: "", handle: "", avatarUrl: "", homeIntro: "", aboutTitle: "", aboutContent: "", links: [], education: [], workExperience: [] }
const displayDate = (value: string | null) => value ? new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Shanghai" }).format(new Date(value)) : ""

export default function Home() {
  const [light, setLight] = useState(false), [view, setView] = useState("Home"), [settings, setSettings] = useState(false), [radius, setRadius] = useState(22), [shadow, setShadow] = useState(true), [accent, setAccent] = useState("#9bf443")
  const [posts, setPosts] = useState<Post[]>([]), [projects, setProjects] = useState<Project[]>([]), [site, setSite] = useState<Site>(emptySite)
  const style = { "--radius": `${radius}px`, "--accent": accent } as CSSProperties
  const initial = site.displayName.trim().slice(0, 1).toUpperCase() || "?"

  useEffect(() => { void Promise.all([fetch(`${api}/posts`).then((response) => response.ok ? response.json() : []), fetch(`${api}/projects`).then((response) => response.ok ? response.json() : []), fetch(`${api}/site`).then((response) => response.ok ? response.json() : emptySite)]).then(([nextPosts, nextProjects, nextSite]) => { setPosts(nextPosts); setProjects(nextProjects); setSite({ ...emptySite, ...nextSite, links: Array.isArray(nextSite.links) ? nextSite.links : [], education: Array.isArray(nextSite.education) ? nextSite.education : [], workExperience: Array.isArray(nextSite.workExperience) ? nextSite.workExperience : [] }) }) }, [])

  return <div className={`site soft serif ${light ? "light" : ""} ${shadow ? "soft-shadow" : ""}`} style={style}>
    <aside>
      <section className="profile-card">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar" style={site.avatarUrl ? { backgroundImage: `url(${site.avatarUrl})` } : undefined}>
            {site.avatarUrl ? null : initial}
          </div>
          <span className="profile-status-dot" title="在线 / 开放交流" />
        </div>
        <h1>{site.displayName || "未设置名称"}</h1>
        <p className="profile-handle">{site.handle ? `@${site.handle.replace(/^@/, "")}` : "未设置账号"}</p>
        <div className="profile-tagline" title={site.homeIntro || undefined}>
          {site.homeIntro || "⚽ Football × 💻 Software × 🤖 AI"}
        </div>
        <div className="profile-stats">
          <div><b>{posts.length}</b><span>篇思考</span></div>
          <div className="stats-divider">|</div>
          <div><b>{projects.length}</b><span>个作品</span></div>
        </div>
        <div className="profile-links">
          {site.links.length ? site.links.map((link) => (
            <a href={link.url} target="_blank" rel="noreferrer" key={`${link.label}-${link.url}`}>
              {link.label}<span>↗</span>
            </a>
          )) : <span className="no-links">请在后台添加个人链接</span>}
        </div>
      </section>
      <nav className="primary-nav">
        {[
          { id: "Home", label: "首页 · Home" },
          { id: "About", label: "关于 · About" },
          { id: "Projects", label: "项目 · Projects" },
          { id: "Blog", label: "博文 · Blog" }
        ].map((item) => (
          <button
            className={`nav-pill ${view === item.id ? "selected" : ""}`}
            onClick={() => setView(item.id)}
            key={item.id}
          >
            <span>{item.label}</span>
            <i className="nav-indicator" />
          </button>
        ))}
      </nav>
      <div className="side-footer">
        <span>© {new Date().getFullYear()} {site.displayName || "Blog"}</span>
      </div>
    </aside>
    <main>{view === "Home" ? <HomeView posts={posts} intro={site.homeIntro} /> : view === "Projects" ? <Projects projects={projects} /> : view === "Blog" ? <Blog posts={posts} /> : <AboutWithResume site={site} />}</main>
    <button className="settings-trigger" onClick={() => setSettings(!settings)} aria-label="Open appearance settings">⚙</button>
    {settings && <section className="settings-panel"><button className="close-settings" onClick={() => setSettings(false)}>×</button><h3>Appearance</h3><label className="setting-line">Night mode <button className="switch" onClick={() => setLight(!light)}><i className={light ? "on" : ""}/></button></label><label className="setting-line">Typeface <b>Serif</b></label><label className="setting-line">Shadow <button className="switch" onClick={() => setShadow(!shadow)}><i className={shadow ? "on" : ""}/></button></label><label className="setting-line color-line">Accent <span>{["#9bf443", "#4bb8ff", "#e4a2d5", "#d7a36b"].map((color) => <button aria-label={`Use ${color}`} className={accent === color ? "chosen" : ""} style={{ background: color }} onClick={() => setAccent(color)} key={color}/>)}</span></label><label className="radius-label">Roundness <input type="range" min="12" max="40" value={radius} onChange={(event) => setRadius(Number(event.target.value))}/></label></section>}
  </div>
}

function HomeView({ posts, intro }: { posts: Post[]; intro: string }) {
  return (
    <>
      <section className="title">
        <div className="title-content">
          <h2>Home</h2>
          <p>{intro || "暂未添加首页简介。"}</p>
        </div>
        <div className="title-badge">
          <i />
          <span>{posts.length} POSTS</span>
        </div>
      </section>
      <PostFeed posts={posts.slice(0, 5)} empty="还没有已发布的文章。" />
    </>
  )
}
function Projects({ projects }: { projects: Project[] }) {
  return (
    <>
      <section className="title">
        <div className="title-content">
          <h2>Projects</h2>
          <p>从项目背景、技术方案到成果展示，点击卡片查看完整作品记录。</p>
        </div>
        <div className="title-badge">
          <i />
          <span>{projects.length} WORKS</span>
        </div>
      </section>
      {projects.length ? (
        <section className="grid project-grid">
          {projects.map((project) => (
            <article className="card project-card" key={project.slug}>
              {project.coverUrl && (
                <Link
                  href={`/projects/${project.slug}`}
                  className="project-cover"
                  style={{ backgroundImage: `url(${project.coverUrl})` }}
                  aria-label={`查看 ${project.title} 详情`}
                />
              )}
              <div className="card-body project-card-body">
                <Link href={`/projects/${project.slug}`} className="project-detail-link">
                  <h3>{project.title}</h3>
                </Link>
                <p>{project.description}</p>
                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="project-actions">
                  <Link className="project-detail-link" href={`/projects/${project.slug}`}>
                    查看详情 →
                  </Link>
                  {project.url && (
                    <a className="project-link" href={project.url} target="_blank" rel="noreferrer">
                      访问项目 ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <p className="empty-state">还没有已发布的项目。</p>
      )}
    </>
  )
}
function Blog({ posts }: { posts: Post[] }) {
  return (
    <>
      <section className="title">
        <div className="title-content">
          <h2>Blog</h2>
          <p>置顶文章会优先展示，其他文章按发布时间排列。</p>
        </div>
        <div className="title-badge">
          <i />
          <span>ALL ARTICLES</span>
        </div>
      </section>
      <PostFeed posts={posts} empty="还没有已发布的文章。" />
    </>
  )
}
function PostFeed({ posts, empty }: { posts: Post[]; empty: string }) {
  if (!posts.length) return <p className="empty-state">{empty}</p>

  const pinnedPost = posts.find((p) => p.pinned)
  const regularPosts = pinnedPost ? posts.filter((p) => p.slug !== pinnedPost.slug) : posts

  return (
    <section className="feed-container">
      {pinnedPost && (
        <article className="hero-post-card">
          <Link href={`/posts/${pinnedPost.slug}`} className="hero-post-link">
            <div className="hero-top-row">
              <span className="hero-pin-badge">★ 置顶精选</span>
              <time className="hero-date">{displayDate(pinnedPost.date)}</time>
            </div>
            <h3 className="hero-title">{pinnedPost.title}</h3>
            <p className="hero-excerpt">{pinnedPost.excerpt || "这篇文章暂未填写摘要。"}</p>
            <div className="hero-footer">
              <div className="tag-group">
                {pinnedPost.tags.map((tag) => (
                  <span className="hero-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <span className="hero-read-more">阅读全文 →</span>
            </div>
          </Link>
        </article>
      )}

      {regularPosts.length > 0 && (
        <div className="post-grid-two-col">
          {regularPosts.map((post) => (
            <article className="bento-post-card" key={post.slug}>
              <Link href={`/posts/${post.slug}`} className="bento-card-link">
                <div className="bento-card-meta">
                  <time>{displayDate(post.date)}</time>
                </div>
                <h4 className="bento-card-title">{post.title}</h4>
                <p className="bento-card-excerpt">{post.excerpt || "这篇文章暂未填写摘要。"}</p>
                <div className="bento-card-footer">
                  <div className="tag-group">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span className="bento-tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                  <span className="bento-read-arrow">→</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
function ResumeSection({ title, items }: { title: string; items: ResumeItem[] }) { if (!items.length) return null; return <section className="resume-section"><div className="resume-heading"><span>RESUME</span><h3>{title}</h3></div><div className="resume-list">{items.map((item, index) => <article className="resume-item" key={`${item.organization}-${item.title}-${index}`}><div className="resume-period">{item.period || "时间待补充"}</div><div className="resume-detail"><div><h4>{item.organization || "未命名经历"}</h4>{item.location && <span>{item.location}</span>}</div>{item.title && <strong>{item.title}</strong>}{item.description && <p>{item.description}</p>}</div></article>)}</div></section> }
function AboutWithResume({ site }: { site: Site }) { return <><section className="title"><h2>{site.aboutTitle || "About"}</h2><p>{site.aboutContent ? "" : "暂未添加个人介绍。"}</p></section>{site.aboutContent && <section className="about-content"><Markdown content={site.aboutContent} /></section>}<div className="resume-sections"><ResumeSection title="教育经历" items={site.education} /><ResumeSection title="工作经历" items={site.workExperience} /></div></> }
