import type { Site } from "../lib/site-data"

export function SiteFooter({ site }: { site: Site }) {
  const name = site.displayName || "Michikatsu"
  return (
    <footer className="site-footer">
      <div>© {new Date().getFullYear()} {name}</div>
      {site.links.length > 0 && (
        <div className="footer-links">
          {site.links.map((link) => (
            <a href={link.url} target="_blank" rel="noreferrer" key={`${link.label}-${link.url}`}>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </footer>
  )
}
