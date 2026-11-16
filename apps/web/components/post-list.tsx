import Link from "next/link"
import { formatDate } from "../lib/format"
import { languageLabel, type ListedPost } from "../lib/posts"

export function PostList({ posts, empty = "Nothing published yet." }: { posts: ListedPost[]; empty?: string }) {
  if (!posts.length) return <p className="empty-state">{empty}</p>

  return (
    <div className="post-list">
      {posts.map((post) => {
        const label = languageLabel(post.languages)
        return (
          <Link className="post-row" href={`/posts/${post.slug}`} key={post.slug}>
            <div className="post-row-date">{formatDate(post.date)}</div>
            <div className="post-row-title">{post.title}</div>
            <div className="post-row-tags">
              {post.tags.slice(0, 2).map((tag) => <span className="chip" key={tag}>{tag}</span>)}
              {label && <span className="chip-outline">{label}</span>}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
