"use client"

import { useEffect, useState } from "react"

type Theme = "light" | "dark"

/** 读取内联脚本已经写好的 data-theme，避免二次判断造成闪烁。 */
const currentTheme = (): Theme => (typeof document !== "undefined" && document.documentElement.dataset.theme === "dark" ? "dark" : "light")

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setTheme(currentTheme())
    setReady(true)
  }, [])

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = next
    try { localStorage.setItem("theme", next) } catch { /* 隐私模式下忽略 */ }
    setTheme(next)
  }

  // 水合完成前两个图标都不渲染，服务端与客户端输出一致。
  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label="Toggle light / dark mode">
      {!ready ? null : theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}
