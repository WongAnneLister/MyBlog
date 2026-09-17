/** 从 Markdown 正文提取一段纯文本，用于 meta description 兜底。 */
export function summarize(markdown: string, limit = 150) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/[*_`~|>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > limit ? `${text.slice(0, limit)}…` : text
}

/** 正文开头若重复了标题（# 标题），渲染时去掉，避免一页两个 h1。 */
export function stripLeadingTitle(markdown: string, title: string) {
  const body = markdown.replace(/^\uFEFF/, "").trimStart()
  const match = body.match(/^#{1,2}\s+(.+?)\s*$/m)
  if (!match || body.indexOf(match[0]) !== 0) return body
  const normalize = (value: string) => value.replace(/[\s*_`#]/g, "").toLowerCase()
  return normalize(match[1]) === normalize(title) ? body.slice(match[0].length).trimStart() : body
}
