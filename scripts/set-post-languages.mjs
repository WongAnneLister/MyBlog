// 给已有文章补 lang 和 translation_key。
//
//   node scripts/set-post-languages.mjs            # 只打印将要执行的 SQL 和受影响的行
//   node scripts/set-post-languages.mjs --apply    # 在一个事务里真正执行
//
// 规则：标题里含中文字符的设为 lang='zh'，其余 'en'；
//       标题或 slug 里含 litellm 的那一组文章共用同一个 translation_key。
import postgres from "postgres"

const apply = process.argv.includes("--apply")
const url = process.env.POSTGRES_URL
if (!url) {
  console.error("缺少 POSTGRES_URL。")
  process.exit(1)
}

const CJK = /[一-鿿]/
const LITELLM_KEY = "litellm-one-request"

const sql = postgres(url)

const statements = [
  `alter table posts add column if not exists lang text not null default 'en'`,
  `alter table posts add column if not exists translation_key text`,
  `create index if not exists posts_translation_key_idx on posts (translation_key)`,
  `update posts set lang = 'zh' where title ~ '[\\u4e00-\\u9fff]'`,
  `update posts set lang = 'en' where title !~ '[\\u4e00-\\u9fff]'`,
  `update posts set translation_key = '${LITELLM_KEY}' where lower(title) like '%litellm%' or lower(slug) like '%litellm%'`
]

const rows = await sql`select id, slug, title, status from posts order by id`

const planned = rows.map((row) => ({
  slug: row.slug,
  title: row.title,
  lang: CJK.test(row.title) ? "zh" : "en",
  translationKey: /litellm/i.test(row.title) || /litellm/i.test(row.slug) ? LITELLM_KEY : null
}))

console.log("\n将要执行的 SQL：\n")
statements.forEach((statement) => console.log(`  ${statement};`))

console.log(`\n受影响的文章（共 ${planned.length} 篇）：\n`)
for (const post of planned) {
  console.log(`  ${post.lang}  ${post.translationKey ? post.translationKey.padEnd(22) : "".padEnd(22)}  ${post.slug}  —  ${post.title}`)
}

const litellm = planned.filter((post) => post.translationKey)
if (litellm.length !== 2) {
  console.log(`\n注意：匹配到 ${litellm.length} 篇 LiteLLM 文章，预期是中英文各一篇。确认后再 --apply。`)
}

if (!apply) {
  console.log("\n这是 dry-run，没有改动任何数据。确认无误后加 --apply 再跑一次。\n")
  await sql.end()
  process.exit(0)
}

await sql.begin(async (tx) => {
  for (const statement of statements) await tx.unsafe(statement)
})
console.log("\n已执行。\n")
await sql.end()
