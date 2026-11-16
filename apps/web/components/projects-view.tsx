import Link from "next/link"
import type { Project } from "../lib/site-data"

export function ProjectsView({ projects }: { projects: Project[] }) {
  const [featured, ...rest] = projects

  return (
    <>
      <div className="page-head">
        <h1>Projects</h1>
        <p>What I&rsquo;ve built, what it runs on, and where to read the code.</p>
      </div>

      {!featured && <p className="empty-state">No projects published yet.</p>}

      {featured && (
        <article className="project-featured">
          <div className="project-featured-media" style={featured.coverUrl ? { backgroundImage: `url(${featured.coverUrl})` } : undefined} />
          <div className="project-featured-body">
            <div>
              <div className="project-kicker">Featured</div>
              <h2>{featured.title}</h2>
            </div>
            {featured.description && <p className="project-desc">{featured.description}</p>}
            {featured.tags.length > 0 && (
              <div className="project-tags">
                {featured.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            )}
            <div className="project-actions">
              <Link className="button" href={`/projects/${featured.slug}`}>Case study →</Link>
              {featured.url && <a className="button-ghost" href={featured.url} target="_blank" rel="noreferrer">Source ↗</a>}
            </div>
          </div>
        </article>
      )}

      {rest.length > 0 && (
        <div className="project-grid">
          {rest.map((project) => (
            <article className="project-card" key={project.slug}>
              <div className="project-card-media" style={project.coverUrl ? { backgroundImage: `url(${project.coverUrl})` } : undefined} />
              <Link href={`/projects/${project.slug}`}><h2>{project.title}</h2></Link>
              {project.description && <p className="project-desc">{project.description}</p>}
              {project.tags.length > 0 && <div className="project-stack">{project.tags.join(" · ")}</div>}
              <div className="project-links">
                <Link href={`/projects/${project.slug}`}>Details →</Link>
                {project.url && <a className="muted-link" href={project.url} target="_blank" rel="noreferrer">Source ↗</a>}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
