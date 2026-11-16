import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { YouTubeEmbed } from "./youtube-embed"
import { parseYouTube } from "../lib/youtube"

type HastNode = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: HastNode[] }

const textOf = (node: HastNode): string => node.type === "text" ? node.value ?? "" : (node.children ?? []).map(textOf).join("")

/** 段落里只有一个 YouTube 链接（前后没有其它文字）时，返回视频信息。 */
function loneYouTubeLink(node?: HastNode) {
  const children = (node?.children ?? []).filter((child) => !(child.type === "text" && !child.value?.trim()))
  if (children.length !== 1) return null
  const [link] = children
  if (link.type !== "element" || link.tagName !== "a") return null
  const href = typeof link.properties?.href === "string" ? link.properties.href : ""
  const video = parseYouTube(href)
  if (!video) return null
  const label = textOf(link).trim()
  return { video, title: label && label !== href ? label : "YouTube video" }
}

const components: Components = {
  // 单独成行的 YouTube 链接渲染成视频；写在句子里的仍是普通链接。
  p({ node, children, ...props }) {
    const embed = loneYouTubeLink(node as HastNode | undefined)
    if (embed) return <YouTubeEmbed video={embed.video} title={embed.title} />
    return <p {...props}>{children}</p>
  }
}

export function Markdown({ content }: { content: string }) {
  return <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>{content}</ReactMarkdown></div>
}
