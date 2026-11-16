export type YouTubeVideo = { id: string; start: number }

const ID = /^[A-Za-z0-9_-]{11}$/

/** 把 t=90 / t=1m30s / start=90 转成秒数。 */
function parseStart(value: string | null) {
  if (!value) return 0
  if (/^\d+$/.test(value)) return Number(value)
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  if (!match) return 0
  const [, h = "0", m = "0", s = "0"] = match
  return Number(h) * 3600 + Number(m) * 60 + Number(s)
}

/**
 * 识别常见的 YouTube 链接：watch?v=、youtu.be/、shorts/、embed/、live/。
 * 不是 YouTube 链接或拿不到合法视频 ID 时返回 null。
 */
export function parseYouTube(raw: string | null | undefined): YouTubeVideo | null {
  if (!raw) return null
  let url: URL
  try { url = new URL(raw.trim()) } catch { return null }

  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "")
  let id: string | null = null
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0]
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v")
    else {
      const match = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([^/?#]+)/)
      id = match?.[1] ?? null
    }
  }

  if (!id || !ID.test(id)) return null
  return { id, start: parseStart(url.searchParams.get("t") ?? url.searchParams.get("start")) }
}

export const youTubeWatchUrl = ({ id, start }: YouTubeVideo) => `https://www.youtube.com/watch?v=${id}${start ? `&t=${start}s` : ""}`
