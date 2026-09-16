# 前端视觉与交互重构实施计划 (Frontend Redesign Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有博客前端由单调生硬的粗黑排版全面升级为「Linear 极客微光暗黑风」与「精修人文思源宋体」结合的现代高级个人网站。

**Architecture:** 基于 Next.js 15 App Router 与纯 CSS 模块化架构。通过 Google Fonts 加载高品质双语字体栈（Noto Serif SC、Newsreader、JetBrains Mono），重构全局 CSS Design Tokens，重构左侧 Profile 栏为一体化微光名片，并将主内容区重构为置顶通栏 Hero 卡片 + 常规文章双列 Bento 网格，优化长文 780px 舒适阅读视宽。

**Tech Stack:** Next.js 15, React 19, CSS3 (Custom Properties, CSS Grid, Glassmorphism & Radial Ambient Glow), Google Fonts (Noto Serif SC, Newsreader, JetBrains Mono, Inter)

---

### Task 1: 字体预加载与全局微光设计系统 (Design Tokens)

**Files:**
- Modify: `apps/web/app/layout.tsx`
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: 在 `layout.tsx` 中引入高阶中英双语字体与预连接**

在 `apps/web/app/layout.tsx` 中添加 Google Fonts 的预连接与样式引入（引入 Noto Serif SC、Newsreader、JetBrains Mono、Inter）。

```tsx
import type { Metadata } from "next"
import "./globals.css"
import "./functional.css"
import "./categories.css"
import "./sidebar-compact.css"
import "./sidebar-clean.css"
import "./markdown.css"
import "./code.css"
import "./reader.css"
import "./feed.css"
import "./about.css"
import "./about-resume.css"
import "./resume.css"
import "./empty-state.css"
import "./admin/admin.css"
import "./admin/admin-layout.css"
import "./admin/avatar.css"
import "./admin/avatar-drag.css"
import "./admin/writer.css"
import "./admin/preview.css"
import "./admin/pins.css"
import "./mobile.css"
import "./responsive-fixes.css"
import "./desktop-layout.css"
import "./project-detail.css"
import "./about-editor.css"
import "./admin/project-editor.css"
import "./admin/resume-editor.css"

export const metadata: Metadata = {
  title: "Michikatsu｜个人网站",
  description: "Michikatsu 的文章、项目与个人介绍"
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: 重构 `globals.css` 中的 Design Tokens 与全局质感**

在 `apps/web/app/globals.css` 中，将 `:root` 变量更新为深邃微蓝暗夜色调、祖母绿微光强调色、半透明细发光边框，配置微光背景渐变。

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

:root {
  --bg: #090a0f;
  --side: #0d0f15;
  --card: #12151e;
  --line: rgba(255, 255, 255, 0.08);
  --dash: rgba(255, 255, 255, 0.06);
  --text: #f1f5f9;
  --muted: #828a9b;
  --tag: rgba(16, 185, 129, 0.12);
  --tag-text: #10b981;
  --badge: #10b981;
  --accent: #10b981;
  --accent-glow: rgba(16, 185, 129, 0.2);
  --font-serif: 'Noto Serif SC', 'Source Han Serif SC', Songti SC, serif;
  --font-editorial: 'Newsreader', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'DM Mono', monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.site {
  min-height: 100vh;
  background: var(--bg);
  background-image: radial-gradient(ellipse 80% 60% at 50% -15%, rgba(16, 185, 129, 0.08), transparent 70%);
  color: var(--text);
  font-family: var(--font-sans);
  transition: background-color 0.25s ease, color 0.25s ease;
  position: relative;
}

.site.light {
  --bg: #f8fafc;
  --side: #ffffff;
  --card: #ffffff;
  --line: #e2e8f0;
  --dash: #cbd5e1;
  --text: #0f172a;
  --muted: #64748b;
  --tag: #e0f2fe;
  --tag-text: #0284c7;
  --badge: #059669;
  --accent: #059669;
  --accent-glow: rgba(5, 150, 105, 0.15);
}

.site * {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}
```

- [ ] **Step 3: 验证编译通过**

Run: `npm run build -w @paperlane/web`
Expected: Compiled successfully with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/layout.tsx apps/web/app/globals.css
git commit -m "style: setup google fonts and emerald dark mode tokens"
```

---

### Task 2: 左侧边栏（Profile 名片与 Pill 导航）一体化重构

**Files:**
- Modify: `apps/web/app/sidebar-clean.css`
- Modify: `apps/web/app/sidebar-compact.css`
- Modify: `apps/web/app/(blog)/page.tsx`

- [ ] **Step 1: 在 `apps/web/app/(blog)/page.tsx` 中升级侧边栏 DOM 结构**

为侧边栏添加在线状态绿点（status dot）、身份标签（`Football Player × Software Engineer × AI`）与全新 Pill 导航微光指示点。

- [ ] **Step 2: 在 `sidebar-clean.css` 中重写侧栏一体化样式**

重构 `.profile-card` 为无边框沉浸式卡片，强化头像多层高阶阴影与微光环，重写导航按钮为现代圆角 Pill 按钮与微光指示点。

- [ ] **Step 3: 验证编译通过**

Run: `npm run build -w @paperlane/web`
Expected: Compiled successfully with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/sidebar-clean.css apps/web/app/sidebar-compact.css apps/web/app/\(blog\)/page.tsx
git commit -m "feat: modernize sidebar profile card and pill navigation"
```

---

### Task 3: 主内容区双列网格与 Hero 置顶卡片架构

**Files:**
- Modify: `apps/web/app/(blog)/page.tsx`
- Modify: `apps/web/app/feed.css`

- [ ] **Step 1: 在 `apps/web/app/(blog)/page.tsx` 中区分置顶文章与常规文章流**

修改 `PostFeed` 组件：
- 将置顶文章（`pinned === true`）提取为独立展示的通栏大卡片（Hero Post Card）；
- 将其余文章放入双列网格容器（`post-grid-two-col`）中展示；
- 标题应用思源宋体，元数据应用等宽字体。

- [ ] **Step 2: 在 `apps/web/app/feed.css` 中实现 Hero 卡片与双列网格样式**

实现：
- `.hero-post-card`：渐变微光底色、祖母绿徽章、阴影渐变、Hover 放大平滑动效；
- `.post-grid-two-col`：桌面端 `grid-template-columns: repeat(2, minmax(0, 1fr))`，移动端自适应回退到单列；
- 普通卡片平滑悬浮位移与边框微光扩散。

- [ ] **Step 3: 验证编译通过**

Run: `npm run build -w @paperlane/web`
Expected: Compiled successfully with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/app/\(blog\)/page.tsx apps/web/app/feed.css
git commit -m "feat: implement hero pinned card and dual-column post grid"
```

---

### Task 4: 人体工程学长文阅读体验与详情页排版精修

**Files:**
- Modify: `apps/web/app/desktop-layout.css`
- Modify: `apps/web/app/markdown.css`
- Modify: `apps/web/app/reader.css`
- Modify: `apps/web/app/project-detail.css`

- [ ] **Step 1: 在 `desktop-layout.css` 与 `reader.css` 中限制正文最大阅读宽度为 780px**

避免宽屏下文字过长导致视线疲劳，居中舒适排版。

- [ ] **Step 2: 在 `markdown.css` 中精修长文排版与代码块质感**

中文字符应用温润的 `Noto Serif SC`，段落行高调为 `1.8`；代码块应用深色磨砂半透明背景与细边框，优化高亮对比度。

- [ ] **Step 3: 优化项目卡片与作品展示详情页**

在 `project-detail.css` 与 `apps/web/app/globals.css` 中优化项目封面图比例、标签微代码胶囊。

- [ ] **Step 4: 验证编译通过**

Run: `npm run build -w @paperlane/web`
Expected: Compiled successfully with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/desktop-layout.css apps/web/app/markdown.css apps/web/app/reader.css apps/web/app/project-detail.css
git commit -m "style: optimize longform reading typography and markdown code blocks"
```

---

### Task 5: 全局集成构建与最终验收验证

**Files:**
- 全局验证

- [ ] **Step 1: 运行全项目构建**

Run: `npm run build`
Expected: `@paperlane/content`, `@paperlane/web`, `@paperlane/api` 全部构建成功。

- [ ] **Step 2: 视觉与交互回归验证**

检查首页、文章列表、置顶 Hero 卡片、项目列表与文章阅读详情页，确保无样式错乱，字体正常生效。

- [ ] **Step 3: 最终 Commit 与清理**

```bash
git status
git commit -m "chore: complete frontend redesign implementation"
```
