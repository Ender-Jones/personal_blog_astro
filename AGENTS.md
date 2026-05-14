# AGENTS.md

本项目是 EnderJones 的新版 Astro blog / research portfolio。

回答与协作要求：
- 对话回答要精简、准确、好理解。
- 开始实现前先读当前代码与 reference，不要凭空重设设计方向。

## 项目目标

- 用 Astro 重构个人 blog / research portfolio，静态构建并部署到 Cloudflare Pages。
- 首页是 Bento-style landing page。
- 文章归档页是 magazine/archive style。
- 单篇文章页强调阅读体验。
- 保留作者识别度：头像、小资料卡、contact/social links、research identity。
- 面向 HR、朋友、researchers、engineers，同时帮助作者通过 worklog 看到持续工作状态。

首页内容优先级：
1. Identity / who I am
2. Research Now / 当前研究方向
3. Recent Writing / 最近文章
4. Current Thread / worklog-derived activity signal
5. Selected Entry
6. Topics / About / GitHub / Marginalia

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
- 不做页面运行时 API 调用；GitHub contribution 等数据只能用 build-time/cache snapshot。
- `AuthorRail` 用于 post/archive/worklog 桌面布局，移动端用 `AuthorStrip`。
- Homepage 使用 `IdentityTile`，不要同时渲染 `AuthorRail`。
- `i18n_alt` 只是指向另一语言文章的 slug，不做完整多语言路由系统。

## Worklog 公开规则

- Homepage Current Thread 不读取完整 worklog body。
- 优先读取 frontmatter `public_thread.summary` 与 `public_thread.bullets`。
- 如果没有 frontmatter，再读取 `public:thread:start/end` 标记之间的内容。
- 标记之外的内容不能进入 homepage summary。
- Full worklog detail page 可以渲染完整 markdown；这表示它是公开页面，不要称其为 private。
- 对敏感内容的处理方式是移出 `src/content/` 或排除构建/部署。

## 验收重点

- Homepage 匹配 Bento v4 设计与内容优先级。
- Archive 根据文章数量自适应搜索/filter/view toggle。
- Post detail 支持 5 个 cover mode。
- `comments: false` 或缺省时没有 Giscus script。
- Worklog homepage tile 只展示公开线程。
- 无 runtime API calls、无 fake live state、无 console errors。
