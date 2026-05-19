# AGENTS.md

本项目是 EnderJones 的新版 Astro blog / research portfolio。

回答与协作要求：
- 对话回答要精简、准确、好理解。
- 开始实现前先读当前代码，不要凭空重设设计方向。
- 需要更多信息的时候直接询问而不是假设
- 先给方案再执行

## 当前状态

截至 2026-05-19：
- 项目使用 Astro 6+，静态输出，正式部署到 Cloudflare Pages。
- `enderjones.com` 已切到新 Astro 站点；Cloudflare Pages project 为 `personal-blog-astro`。
- GitHub Actions 只做 release gate，不部署 GitHub Pages。
- 旧 Jekyll repo / old Pages project 只保留历史，不再作为新版站点 reference。
- `reference/` 已删除；不要再依赖旧 reference 文件夹。
- 本地开发优先使用 Docker Compose 的 `site` 服务运行 Node/npm。
- Content collections 配置在 `src/content.config.ts`。
- 已有 collections：`posts`、`worklogs`。
- 集中数据：`src/data/site.yml`、`src/data/research.yml`、`src/data/tags.yml`、`src/data/github-activity.json`。
- 已实现页面：Homepage、posts、post detail、worklog、worklog detail、tags、tag detail、about、404、robots、sitemap。
- 当前没有 `/research` 页面；除非有明确论文列表或研究叙事，不要新建空 research route。

## 当前设计方向

- Homepage 已定稿为 dark editorial notebook / research archive landing。
- Homepage 结构：
  - §01 Identity：terminal identity + portrait card
  - §02 Writing：post rail + writing preview
  - §03 Activity：Current Thread + GitHub build-time contribution snapshot + Tag Index
  - §04 Marginalia / contact
- Homepage intro 是纯文字 editorial splash，使用 sessionStorage 控制单 session 一次。
- 不要引入 View Transitions、SPA、SSR runtime、新 hero 视觉方向或旧 Bento dashboard。
- Archive 保持 timeline/list + tag chips；文章数量少时不要加 search、filter、view toggle。

## 必须完成的后端工程备忘条款

- Homepage Marginalia 只能从 posts frontmatter 的 `marginalia` 读取；quote 使用 `marginalia.quote.lines + author/work/year` 显式格式，不能从正文猜测。
- Posts 默认启用 Giscus comments；单篇只能通过 `comments: false` 关闭，且 `src/data/site.yml` 必须有真实 Giscus 配置才允许输出脚本。
- Worklogs 不启用 comments，schema 不应接受 comments 字段。
- GitHub activity / commit wall 只能读取 build-time GitHub contribution cache snapshot；无 snapshot 时显示空状态，不做 runtime API 或伪造数据。
- Worklog parser 只能读取 `public_thread` 或 `<!-- public:thread:start -->` block；不能把 raw worklog notes 自动上 Homepage。
- Build 必须阻塞坏内容和坏产物：draft frontmatter、Kramdown attr-list、remark directive callouts、坏图片/内链、空 public thread、无效 Marginalia、worklog comments、缺 tag metadata、runtime API calls、缺失部署文件、缺失生成路由、错误 sitemap/robots。
- Posts 已迁移为 MDX；图片、题记、提示块、诗歌布局使用 `src/components/content/` 的 `Figure`、`Epigraph`、`Callout`、`Poem`。
- 未完成文章放 root `drafts/`；不引入 `draft: true`。

## 内容与图片

- 新页面级图片、cover、avatar 优先放 `public/img/`。
- `public/assets/img/` 只保留 favicons 和仍被 MDX 引用的旧正文内联图片。
- 不主动迁移到 `src/assets/`；如果后续要用 Astro `<Image />` / `<Picture />`，先制定统一图片策略。
- 不新增 fake live widgets、fake comments、runtime API calls、RSS/feed，除非用户明确改变约束。

## 目录约定

- `src/pages/index.astro`：Homepage 数据装配与页面级 section 排布。
- `src/components/home/*`：Homepage 专用 section。
- `src/components/archive/*`：文章归档组件。
- `src/components/post/*`：单篇文章组件。
- `src/components/author/*`：跨页面作者组件。
- `src/components/content/*`：MDX 内容语义组件。
- `src/components/layout/*`：全站 layout、nav、footer、backdrop。
- `src/styles/tokens.css`：颜色、字体、间距、霓虹按钮等 tokens。
- `src/styles/base.css`：全站基础元素与跨页面 utility。
- `src/styles/prose.css`：Markdown/MDX 正文排版。
- `src/lib/content.ts`：内容排序、链接、reading stats、tags。
- `src/lib/parseWorklog.ts`：公开 worklog thread 解析。
- `src/lib/gitActivity.ts`：build-time GitHub contribution snapshot。
- `src/lib/tags.ts`：Homepage tag summary 与 tag tone。
- `scripts/lib/content-utils.mjs`：build/validation scripts 共用的文件、frontmatter、route helper；不要在各脚本重复实现。

## CSS / 实现规则

- 优先使用 Astro component-scoped `<style>`。
- 跨页面共享样式只放真正通用的 tokens/base/prose。
- 重复视觉模式优先 token 化或放到 `base.css` utility，例如 `.neon-pill`。
- 不使用 `!important` 作为常规手段。
- 避免 `:global()`；如必须跨组件布局，优先在父组件加语义 wrapper class。
- 页面文件负责页面级 grid/section 排布；组件负责自己的内部样式。
- 移动端按内容优先级重新排序，不做简单桌面缩小。
- 需要交互时才加 client JS；默认保持静态 HTML。

## 验收基线

- 常规验证命令：`docker compose run --rm site npm run build`
- 本地完整迁移审计：`docker compose run --rm site npm run release:check`
- `npm run build` 包含 content validation、`astro check`、`astro build`、artifact verification。
- old blog audit 在旧 repo 不可见的 Docker/CI 环境会跳过；需要强制审计时设置 `OLD_BLOG_DIR` 或 `AUDIT_OLD_BLOG_REQUIRED=1`。
- 关键路由：`/`、`/posts/`、post detail、`/tags/`、tag detail、`/worklog/`、worklog detail、`/about/`。
