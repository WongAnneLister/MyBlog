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

type MdastNode = { type: string; value?: string; url?: string; children?: MdastNode[] }

const decode = (value: string) => value.replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'")

/** 从 YouTube「分享 → 嵌入」复制来的 <iframe> 代码里取出视频地址和标题。 */
function youTubeFromIframe(html: string) {
  const src = html.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]
  if (!src || !parseYouTube(decode(src))) return null
  const title = html.match(/<iframe\b[^>]*\btitle\s*=\s*["']([^"']*)["']/i)?.[1]
  return { url: decode(src), title: title ? decode(title) : "" }
}

/**
 * Markdown 不渲染原始 HTML（出于安全会当文字转义），所以把 YouTube 的 iframe 代码
 * 换成同一个视频的链接，交给下面的段落规则渲染成播放器。其它 HTML 保持原样。
 */
function remarkYouTubeIframe() {
  const walk = (node: MdastNode, inParagraph: boolean) => {
    node.children = node.children?.map((child) => {
      if (child.type === "html" && child.value) {
        const video = youTubeFromIframe(child.value)
        if (video) {
          const link: MdastNode = { type: "link", url: video.url, children: [{ type: "text", value: video.title || video.url }] }
          return inParagraph ? link : { type: "paragraph", children: [link] }
        }
      }
      walk(child, inParagraph || child.type === "paragraph")
      return child
    })
  }
  return (tree: MdastNode) => walk(tree, false)
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
  return <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm, remarkYouTubeIframe]} rehypePlugins={[rehypeHighlight]} components={components}>{content}</ReactMarkdown></div>
}
