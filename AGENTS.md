# AGENTS.md

本项目是 EnderJones 的新版 Astro blog / research portfolio。

回答与协作要求：
- 对话回答要精简、准确、好理解。
- 开始实现前先读当前代码与 reference，不要凭空重设设计方向。

## 项目目标

- 用 Astro 重构个人 blog / research portfolio，静态构建并部署到 Cloudflare Pages。
- 首页曾以 Bento-style landing page 为起点；当前已转向 `homepage-v5.jsx` 的 editorial notebook / research archive landing。
- 文章归档页是 magazine/archive style。
- 单篇文章页强调阅读体验。
- 保留作者识别度：头像、小资料卡、contact/social links、research identity。
- 面向 HR、朋友、researchers、engineers，同时帮助作者通过 worklog 看到持续工作状态。

首页内容优先级：
1. Identity / research identity
2. Recent Writing / 最近文章
3. Current Thread / worklog-derived activity signal
4. GitHub build trace / tag index
5. Marginalia / About contact

## 设计来源

- `reference/claude_redesign/` 是主要设计来源。
- 优先阅读：
  - `reference/claude_redesign/README_EXPORT.md`
  - `reference/claude_redesign/CODEX_HANDOFF.md`
  - `reference/claude_redesign/e-bento.jsx`
  - `reference/claude_redesign/homepage-designs.jsx`
  - `reference/claude_redesign/archive-page.jsx`
  - `reference/claude_redesign/post-detail.jsx`
  - `reference/claude_redesign/tokens.css`
- `Homepage Redesign.html` 是视觉规格参考；JSX 原型只作像素与结构参考，不直接搬代码。
- 当前 homepage 的最新主要参考是：
  - `reference/claude_redesign/Homepage Redesign.html`
  - `reference/claude_redesign/homepage-v5.jsx`
- `homepage-v5.jsx` 的核心方向是 editorial notebook：
  - §01 terminal identity + portrait card
  - §02 左侧 scroll-drum post rail + 右侧 writing preview
  - §03 Current Thread editorial card + GitHub/profile + tag index
  - §04 full-width Marginalia + slim contact strip
- 当前 `src/` 内旧 Bento homepage 组件已移除；如需参考旧 Bento 方向，只看
  `reference/`，不要在当前 Home 里重新引入旧 Bento dashboard。
- `reference/old_blog/` 只作旧内容、氛围、头像/author presence、旧文章结构参考，不直接复刻旧站，不搬旧站代码。

如果 reference 与用户明确约束冲突，以用户明确约束为准。

## 硬约束

- 不重新设计，不发明新的视觉方向。
- 不修改 `reference/` 内文件，除非用户明确要求。
- 不做 fake live widgets。
- 不做 fake comments。
- 不把 raw worklog notes 自动展示到 homepage。
- Homepage 的 Current Thread 只能读取：
  - worklog frontmatter 的 `public_thread`
  - 或 markdown 里的 `<!-- public:thread:start --> ... <!-- public:thread:end -->`
- 不要把 `noindex` 当作隐私保护。
- 真正敏感的 worklog/content 必须 excluded from build/deploy，而不是只 noindex。
- Giscus comments 默认关闭，只能通过 posts frontmatter 的 `comments: true` 启用。
- Worklogs 默认不启用 comments，并且 schema 不应接受 comments 字段。
- `cover_mode` 必须只支持：
  - `hero-large`
  - `hero-small`
  - `showcase`
  - `strip`
  - `none`
- 不加入 `inline` cover mode；如果 reference 里出现 `inline`，视为旧残留。
- 不做 RSS/feed，除非用户明确改变该约束。

## 推荐实现方向

- Astro 4+，静态输出，Cloudflare Pages。
- 当前实现使用 Astro 6+；content collections 配置文件使用 `src/content.config.ts`，不要使用旧版 `src/content/config.ts`。
- 使用 Astro content collections：
  - `posts`
  - `worklogs`
- 使用数据文件集中维护：
  - `src/data/site.yml`
  - `src/data/research.yml`
  - `src/data/quotes.yml`
- Client JS 预算保持很小，只用于：
  - reading progress
  - TOC scrollspy
  - archive search/filter 在文章数量足够时启用
  - lazy Giscus mount
- Markdown 正文支持 `remark-math` + `rehype-katex`，数学公式样式通过全站 prose CSS 收口。
- 不做页面运行时 API 调用；GitHub contribution 等数据只能用 build-time/cache snapshot。
- Home 的 GitHub/commit wall 当前读取 build-time local git history；如果构建环境没有
  `.git` 历史，应渲染为空 activity wall，而不是伪造提交。
- `AuthorRail` 用于 post/archive/worklog 桌面布局，移动端用 `AuthorStrip`。
- Homepage 使用 `src/components/home/*` 的专用组件，不要同时渲染 `AuthorRail`。
- `i18n_alt` 只是指向另一语言文章的 slug，不做完整多语言路由系统。

## 当前进度快照

截至 2026-05-16：
- Astro 6+ 基础项目已建立，使用 Docker Compose 的 `site` 服务运行 Node/npm，减少污染本机包环境。
- 已实现 content collections：`posts` 与 `worklogs`。
- 已实现数据集中维护：`src/data/site.yml`、`src/data/research.yml`、`src/data/quotes.yml`。
- 已实现主要页面：
  - Homepage：当前已按 `homepage-v5.jsx` 方向定稿为 dark editorial notebook / research archive；§01 使用 terminal identity + portrait card。
  - Archive/posts：magazine/archive style 已有基础实现。
  - Post detail：阅读体验、cover modes、KaTeX 静态数学公式渲染已有基础实现。
  - Worklog：公开 worklog 页面与 homepage current thread 数据来源已打通。
  - Tags/About：已有基础页面。
- Homepage 当前结构：
  - `src/pages/index.astro` 负责首页数据装配与页面级 section 排布。
  - `src/components/home/HeroSection.astro`
  - `src/components/home/WritingSurface.astro`
  - `src/components/home/ActivityEvidence.astro`
  - `src/components/home/PersonalityContact.astro`
- Homepage 当前数据来源：
  - `posts` collection：§02 writing rail、preview、tag index。
  - `worklogs` collection：只通过 `getCurrentThread()` 暴露 `public_thread` 或 `public:thread` block。
  - `src/data/site.yml`：identity、avatar、hero portrait、social/contact links。
  - `src/data/research.yml`：About 页面研究摘要；不再驱动 homepage 独立 research card。
  - `src/data/quotes.yml`：§04 Marginalia quote。
  - `src/lib/gitActivity.ts`：build-time local git commit wall，不做 runtime API。
- Homepage 当前 helper：
  - `src/lib/parseWorklog.ts`：公开 worklog thread 解析。
  - `src/lib/gitActivity.ts`：build-time git activity snapshot。
  - `src/lib/tags.ts`：Home tag summary 与 research/private tag tone。
- Homepage 已处理：
  - 首屏不再是拥挤 dashboard。
  - §01 identity terminal / portrait card 已按 dark cyber-anime research 氛围定稿，prompt/name 使用 pink，focus/action 使用 cyan，普通层级收敛到 gray。
  - Writing section 使用轻量 client JS 做 post rail preview 切换。
  - §03 Current Thread editorial card 与其他页面 AuthorRail 复用 `getCurrentThread()` / `parseWorklog` 数据来源。
  - 不展示 raw worklog notes。
  - 不做 RSS、fake comments、fake GitHub heatmap/commits/live widgets。
  - 全站共享 `SiteBackdrop` 深海军背景、低透明 grid、scroll-coupled ambient glow。
  - Footer 与 Hero contact 入口已收敛到 `reach me →` / About。
  - 旧 Bento 组件、旧 selected entry helper、未使用 homepage research/thread compact 组件已从 `src/` 移除。
  - Markdown 内的旧 `<style>` / inline style 已迁到 `src/styles/prose.css`，正文只保留语义 HTML/class。
  - favicon 已接入 `BaseLayout`；未引用且过大的 `favicon.svg` 已移除。
- 最近一次验证：
  - `docker compose run --rm site npm run build` 通过，`astro check` 为 0 errors / 0 warnings / 0 hints。
  - 本地关键路由 `/`、`/posts/`、post detail、`/tags/`、tag detail、`/worklog/`、worklog detail、`/about/` 返回 200。
  - Browser runtime 检查 `/`、`/posts/`、两篇 post detail、`/worklog/`、`/about/` 无 console error、无 broken images、无横向溢出。
  - WritingSurface preview 切换可用；迁移后的 poem / translation prose 样式已确认生效，正文内无残留 `<style>`。
  - Browser 截图工具曾返回 Bad Request；如需像素级确认，优先让用户看当前浏览器或重新授予 screen capture 权限。

## 当前目录约定

- `src/components/home/`：首页 v5 editorial notebook sections。
- `src/components/bento/`：已从 `src/` 移除。Bento 只作为 reference 历史方向存在，不是当前实现目录。
- `src/components/archive/`：文章归档页组件。
- `src/components/post/`：单篇文章页专用组件，例如 cover/header。
- `src/components/author/`：跨页面作者存在感组件，例如 `AuthorRail` / `AuthorStrip`。
- `src/styles/base.css` 只放全站基础元素和真正跨页面 UI，例如 nav/footer、route header、surface panel。
- `src/styles/prose.css` 只放 markdown 正文排版，以及迁移文章需要的少量 class-based prose helper。
- `src/lib/`：内容排序/链接、公开 worklog 解析、build-time git activity、Home tag summary 等无 UI 数据逻辑。
- `public/img/`：当前页面直接引用的 avatar、homepage portrait、post cover 等运行时图片。
- `public/assets/img/`：favicons 与迁移文章内联图片；不要新增页面级/cover 图片到这里。

## CSS / Responsive 规则

- 当可维护性与视觉/阅读体验冲突时，优先保证页面好看、好读、贴近 reference；再用清晰目录和局部 CSS 收住复杂度。
- CSS 要保持低优先级、局部化、可维护。
- 优先使用 Astro component-scoped `<style>`；跨页面共享样式只放真正通用的 tokens/base/prose。
- 不使用 `!important` 作为常规手段。
- 避免 `:global()`；如果必须跨组件布局，优先在父组件加语义 wrapper class。JS 动态生成且拿不到 Astro scope attribute 的节点可以用 tightly rooted `:global([data-*] ...)`。
- Markdown 内容文件不要内嵌 `<style>` 或 inline style；需要特殊正文样式时使用语义 class，并把样式放进 `prose.css`。
- 页面文件负责页面级 grid/section 排布；tile/card/row 组件负责自己的内部样式。
- 不让一个页面级 CSS 文件深度选择组件内部 DOM。
- 移动端不是桌面缩小版，要按内容优先级重新排序。
- 首页当前不是严格 12 栏 Bento；桌面以 v5 editorial grid 为准，平板收敛，手机单列。
- 手机端优先保留：Identity、Recent Writing、Current Thread、Marginalia。
- 手机端减少 padding、固定图片比例/高度、避免长标题挤爆卡片。
- Archive 手机端可隐藏缩略图和多余 tags，保留日期、标题、摘要。
- Post detail 手机端优先正文宽度与行高；TOC 后续使用 `<details>`，不要强行 sticky。

## Astro 使用建议

- 需要交互时才加 client JS；默认保持静态 HTML。
- 图片后续可逐步从 `public/` 迁到 `src/assets/`，用 Astro `<Image />` / `<Picture />` 做响应式优化。
- View Transitions 可以后期考虑，但不是当前优先级；先保证布局、阅读体验和可访问性。

## Worklog 公开规则

- Homepage Current Thread 不读取完整 worklog body。
- 优先读取 frontmatter `public_thread.summary` 与 `public_thread.bullets`。
- 如果没有 frontmatter，再读取 `public:thread:start/end` 标记之间的内容。
- 标记之外的内容不能进入 homepage summary。
- Full worklog detail page 可以渲染完整 markdown；这表示它是公开页面，不要称其为 private。
- 对敏感内容的处理方式是移出 `src/content/` 或排除构建/部署。

## 验收重点

- Homepage 匹配 `homepage-v5.jsx` / `Homepage Redesign.html` 的 editorial notebook 方向，同时保留旧站 dark navy / pink / cyan / research notebook DNA。
- Archive 根据文章数量自适应搜索/filter/view toggle。
- Post detail 支持 5 个 cover mode。
- `comments: false` 或缺省时没有 Giscus script。
- Homepage Current Thread 只展示公开线程。
- 无 runtime API calls、无 fake live state、无 console errors。
