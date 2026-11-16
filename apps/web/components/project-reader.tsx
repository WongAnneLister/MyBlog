import Link from "next/link"
import { Markdown } from "./markdown"

type Project = { title: string; description: string; content: string; coverUrl: string; tags: string[]; url: string }

export function ProjectReader({ project }: { project: Project }) {
  return (
    <article className="article">
      <Link className="article-back" href="/projects">← All projects</Link>
      <h1>{project.title}</h1>

      <div className="article-head">
        <div className="article-meta">{project.tags.join(" · ")}</div>
        {project.url && <a className="button-ghost" href={project.url} target="_blank" rel="noreferrer">Source ↗</a>}
      </div>

      {project.coverUrl && <img className="article-cover" src={project.coverUrl} alt={`${project.title} cover`} />}
      {project.description && <p className="article-lead">{project.description}</p>}

      <Markdown content={project.content || "This case study is still being written."} />
    </article>
  )
}
