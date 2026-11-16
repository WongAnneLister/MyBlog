import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export type NavKey = "writing" | "projects" | "about" | null

const navItems: { key: Exclude<NavKey, null>; label: string; href: string }[] = [
  { key: "writing", label: "Writing", href: "/posts" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "about", label: "About", href: "/about" }
]

export function SiteHeader({ name, active = null }: { name: string; active?: NavKey }) {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-dot" aria-hidden="true" />
        {name}
      </Link>
      <nav className="site-nav" aria-label="Primary">
        {navItems.map((item) => (
          <Link key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined}>
            {item.label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </header>
  )
}
