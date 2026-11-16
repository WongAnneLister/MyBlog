import { Markdown } from "./markdown"
import type { ResumeItem, Site } from "../lib/site-data"

function ResumeSection({ title, items }: { title: string; items: ResumeItem[] }) {
  if (!items.length) return null
  return (
    <section className="resume-section">
      <h2>{title}</h2>
      {items.map((item, index) => (
        <article className="resume-item" key={`${item.organization}-${item.title}-${index}`}>
          <div className="resume-period">{item.period}</div>
          <div className="resume-detail">
            {item.organization && <h3>{item.organization}</h3>}
            {item.title && <span className="resume-role">{item.title}</span>}
            {item.location && <span className="resume-place">{item.location}</span>}
            {item.description && <p>{item.description}</p>}
          </div>
        </article>
      ))}
    </section>
  )
}

export function AboutView({ site }: { site: Site }) {
  return (
    <>
      <div className="page-head">
        <h1>{site.aboutTitle || "About"}</h1>
      </div>
      {site.aboutContent
        ? <div className="about-body"><Markdown content={site.aboutContent} /></div>
        : <p className="empty-state">Nothing here yet.</p>}
      <div className="resume-sections">
        <ResumeSection title="Education" items={site.education} />
        <ResumeSection title="Experience" items={site.workExperience} />
      </div>
    </>
  )
}
