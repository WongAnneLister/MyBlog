# 自托管字体

由 `app/layout.tsx` 通过 `next/font/local` 加载，构建时不联网。

| 文件 | 字体 | 字重 | 来源 |
| --- | --- | --- | --- |
| `newsreader-latin.woff2` | Newsreader（可变字体，含 opsz 轴） | 400–600 | Google Fonts，latin 子集 |
| `newsreader-italic-latin.woff2` | Newsreader Italic | 400–600 | Google Fonts，latin 子集 |
| `jetbrains-mono-latin.woff2` | JetBrains Mono（可变字体） | 400–500 | Google Fonts，latin 子集 |

两种字体都以 SIL Open Font License 1.1 发布，允许自托管与再分发。

中文字体（Noto Serif SC）切片太多，不放在这里，由 `layout.tsx` 在运行时引用 Google Fonts 样式表按需加载。
