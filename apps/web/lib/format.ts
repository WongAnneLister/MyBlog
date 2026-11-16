const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Shanghai" })

/** 站点统一的英文日期格式：Oct 17, 2026。 */
export function formatDate(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date)
}

/** 阅读时长：8 min read。 */
export function readingTime(minutes: number) {
  return `${Math.max(1, Math.round(minutes || 0))} min read`
}
