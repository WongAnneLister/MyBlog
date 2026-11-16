import Link from "next/link"
import { LinkIcon } from "./link-icon"
import { PostList } from "./post-list"
import { YouTubeEmbed } from "./youtube-embed"
import { parseYouTube } from "../lib/youtube"
import { groupByTranslation } from "../lib/posts"
import type { Post, Project, Site } from "../lib/site-data"

export function HomeView({ site, posts, projects }: { site: Site; posts: Post[]; projects: Project[] }) {
  const name = site.displayName || "Michikatsu"
  const initial = name.trim().slice(0, 1).toUpperCase() || "?"
  const featured = projects.slice(0, 3)
  const recent = groupByTranslation(posts).slice(0, 5)
  const introVideo = parseYouTube(site.introVideoUrl)

  return (
    <>
      <section className="hero">
        <div className="hero-main">
          <h1>Hi, I&rsquo;m {name}.</h1>
          {site.homeIntro && <p className="hero-intro">{site.homeIntro}</p>}
          {site.links.length > 0 && (
            <div className="hero-actions">
              {site.links.map((link, index) => (
                <a className={index === 0 ? "button" : "button-ghost"} href={link.url} target="_blank" rel="noreferrer" key={`${link.label}-${link.url}`}>
                  <LinkIcon url={link.url} label={link.label} />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="hero-aside">
          <div className="hero-avatar" style={site.avatarUrl ? { backgroundImage: `url(${site.avatarUrl})` } : undefined}>
            {site.avatarUrl ? null : initial}
          </div>
        </div>
      </section>

      {introVideo && (
        <section className="home-video" aria-label="Intro video">
          <YouTubeEmbed video={introVideo} title={`${name} intro video`} />
        </section>
      )}

      <section className="home-section">
        <div className="section-head">
          <h2>Selected work</h2>
          <Link className="section-more" href="/projects">All projects →</Link>
        </div>
        {featured.length ? featured.map((project) => (
          <Link className="work-row" href={`/projects/${project.slug}`} key={project.slug}>
            <div className="work-media" style={project.coverUrl ? { backgroundImage: `url(${project.coverUrl})` } : undefined} />
            <div className="work-body">
              <h3>{project.title}</h3>
              {project.description && <p className="work-desc">{project.description}</p>}
              {project.tags.length > 0 && <div className="work-stack">{project.tags.join(" · ")}</div>}
            </div>
          </Link>
        )) : <p className="empty-state">No projects published yet.</p>}
      </section>

      <section className="home-section">
        <div className="section-head">
          <h2>Writing</h2>
          <Link className="section-more" href="/posts">All posts →</Link>
        </div>
        <PostList posts={recent} empty="No posts published yet." />
      </section>
    </>
  )
}
