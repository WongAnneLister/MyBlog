"use client"

import { useState } from "react"
import { youTubeWatchUrl, type YouTubeVideo } from "../lib/youtube"

/**
 * 先只显示封面和播放按钮，点击后才加载 YouTube 播放器（约 1 MB 脚本），
 * 首屏不被拖慢。播放器走 youtube-nocookie.com，点播放前不写 Cookie。
 * 下方保留一个外链，YouTube 加载不出来（例如中国大陆）时还能跳过去看。
 */
export function YouTubeEmbed({ video, title = "YouTube video" }: { video: YouTubeVideo; title?: string }) {
  const [playing, setPlaying] = useState(false)
  const params = new URLSearchParams({ autoplay: "1", rel: "0" })
  if (video.start) params.set("start", String(video.start))

  return (
    <figure className="video-embed">
      <div className="video-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?${params}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="video-poster"
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${video.id}/hqdefault.jpg)` }}
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
          >
            <span className="video-play" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption>
        <a href={youTubeWatchUrl(video)} target="_blank" rel="noreferrer">Watch on YouTube ↗</a>
      </figcaption>
    </figure>
  )
}
