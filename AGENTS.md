# AGENTS.md

本项目是 EnderJones 的新版 Astro blog / research portfolio。

回答与协作要求：
- 对话回答要精简、准确、好理解。
- 开始实现前先读当前代码与必要 reference，不要凭空重设设计方向。

## 当前状态

截至 2026-05-17：
- 项目使用 Astro 6+，静态输出，目标部署到 Cloudflare Pages。
- 本地开发优先使用 Docker Compose 的 `site` 服务运行 Node/npm。
- Content collections 配置在 `src/content.config.ts`，不是旧版 `src/content/config.ts`。
- 已有 collections：
  - `posts`
  - `worklogs`
- 已有集中数据：
  - `src/data/site.yml`
  - `src/data/research.yml`
  - `src/data/tags.yml`
- 已实现页面：
  - Homepage
  - `/posts/`
  - post detail
  - `/worklog/`
  - worklog detail
  - `/tags/`
  - tag detail
  - `/about/`
- 当前没有 `/research` 页面；除非有明确论文列表或研究叙事，不要新建空 research route。

## 当前设计方向

- Homepage 已定稿为 dark editorial notebook / research archive landing。
- Homepage 结构：
  - §01 Identity：terminal identity + portrait card
  - §02 Writing：post rail + writing preview
  - §03 Activity：Current Thread + GitHub build trace + Tag Index
  - §04 Marginalia / contact
- 后续如果给 Homepage 增加 intro，方向是纯文字 editorial intro。
- 不要引入 View Transitions、动效叙事、新 hero 视觉方向或旧 Bento dashboard。
- Archive 当前保持 timeline/list + tag chips；文章数量少时不要加 search、filter、view toggle。

主要设计参考：
- `reference/claude_redesign/Homepage Redesign.html`
- `reference/claude_redesign/homepage-v5.jsx`
- `reference/claude_redesign/archive-page.jsx`
- `reference/claude_redesign/post-detail.jsx`
- `reference/claude_redesign/tokens.css`

`reference/old_blog/` 只用于旧内容、旧图片、氛围和 author presence 参考，不搬旧站代码。

## 下一轮后端 / 内容优先级

下一轮准备直接做内容后端，优先顺序：

1. 实现 Chirpy / Kramdown admonition 迁移与渲染。
   - 旧写法如 `{: .prompt-info }`、`{: .prompt-tip }` 不能进入新版 content。
   - 迁移为明确 directive/container 语法，例如 `:::info ... :::`、`:::tip ... :::`。
   - 在 Astro markdown pipeline 中实现对应渲染，必要时新增 `remark-directive` 或等价方案。
   - 在 `src/styles/prose.css` 中统一收口 admonition 样式。
   - 迁移旧文章时不要只删除标记导致语义丢失。
2. 检查并补齐旧文章迁移。
   - 当前已发布 posts：
     - `who-am-i`
     - `regression-model-evaluation-metrics`
     - `prompt-engineering-and-major-model-takes`
     - `what-distance-taught-us`
   - 旧 `2026-05-13-Context-file-management` 只有占位正文，缺 date、description、完整正文和最终 tags；需要作者提供信息后再发布。
3. 中文 / 双语支持排在最后。
   - 短期只保留 `i18n_alt` 指向另一语言文章 slug。
   - 内容和结构稳定前不要做完整多语言路由系统。

## 必须完成的后端工程备忘条款

- Homepage Marginalia 必须从带 `marginalia` 的 posts frontmatter 读取，并使用该 post 的真实图片；quote 使用 `marginalia.quote.lines + author/work/year` 显式格式，不能从正文猜测；选择可以是 build-time random，但不能做 runtime API、fake live widget 或伪随机评论/内容。
- Giscus comments 默认关闭；只有 post frontmatter `comments: true` 且 `src/data/site.yml` 有真实 Giscus 配置时才允许输出评论脚本。
- 当前 GitHub 仓库 `Ender-Jones/personal_blog_astro` 已启用 Discussions；Giscus 使用真实 `General` category 配置，发布前仍需确认 Giscus app 已安装/授权到该 repo。
- GitHub activity / commit wall 只能读取 build-time git history/cache snapshot；无 history 时必须显示空状态，不伪造 commit。
- Worklog parser 只能读取 `public_thread` 或 `<!-- public:thread:start -->` block；不能把 raw worklog notes 自动上 Homepage。
- Build 必须阻塞坏内容和坏产物：draft frontmatter、旧 Kramdown attr-list、坏图片/内链、空 public thread、无效 Marginalia、worklog comments、缺 tag metadata、runtime API calls、缺失部署文件、缺失生成路由、错误 sitemap/robots。

## 性能优化结论

当前站点性能方向正确：继续保留 Astro static，不要重写成 SPA、SSR runtime 或 runtime API 架构。
如果做“渲染效果 99% 不变”的架构整理，优先只重写 pipeline 和轻量脚本层。

性能优化优先级：

| 顺序 | 项目 | 用户端性能收益 | 重写难度 | 维护性收益 | 结论 |
| --- | --- | --- | --- | --- | --- |
| 1 | 图片 pipeline | 高 | 中 | 高 | 统一图片策略，给关键图片补 `width`/`height`、`decoding`、`fetchpriority`，输出响应式尺寸/WebP/AVIF；这是 LCP/CLS 最大收益点。 |
| 2 | CSS 分层加载 | 中 | 低-中 | 中 | `BaseLayout` 不应让所有页面都加载 prose/KaTeX；post/worklog 再加载正文和数学样式。 |
| 3 | 浏览器脚本 TS 模块化 | 低-中 | 中 | 高 | 把 `SiteBackdrop`、`WritingSurface`、`ReadingProgress` 从 inline script 收到 `src/scripts/*.ts`，按页面存在性初始化。 |
| 4 | 背景动效降成本 | 低-中 | 低 | 中 | 移动端和 reduced-motion 下禁用 scroll parallax，保留静态 dark backdrop。 |
| 5 | 内容/Markdown pipeline | 低 | 中 | 高 | admonition directive、content validation、图片路径验证属于维护收益优先，间接减少坏内容进入 build。 |
| 6 | HTML 微缩减 | 低 | 低 | 低 | commit wall、重复 author strip/rail 等暂不是瓶颈；只在明显变大后处理。 |

不要为了性能优先做：
- 换框架。
- 加 runtime backend/API。
- 大规模重写 Homepage 视觉。
- 为了“全 TS”强行改 reference 或纯配置文件。

## 硬约束

- 不修改 `reference/`，除非用户明确要求。
- 不做 fake live widgets。
- 不做 fake comments。
- 不做 runtime API calls。
- 不做 RSS/feed，除非用户明确改变约束。
- GitHub activity 只能使用 build-time/cache snapshot；没有 `.git` 历史时渲染为空 activity wall，不伪造数据。
- Homepage Current Thread 只能读取：
  - worklog frontmatter 的 `public_thread`
  - 或 markdown 中 `<!-- public:thread:start --> ... <!-- public:thread:end -->`
- 不把 raw worklog notes 自动展示到 Homepage。
- 不要把 `noindex` 当作隐私保护；敏感 worklog/content 必须排除出 build/deploy。
- Worklog detail page 如果被构建出来，就是公开页面，不要称其为 private。
- Giscus comments 默认关闭，只能通过 posts frontmatter `comments: true` 启用。
- Worklogs 默认不启用 comments，schema 不应接受 comments 字段。
- `cover_mode` 只支持：
  - `hero-large`
  - `hero-small`
  - `showcase`
  - `strip`
  - `none`
- 不加入 `inline` cover mode。
- Markdown 内容文件不要内嵌 `<style>`、inline style 或 Chirpy/Kramdown attribute-list 行。

## 内容与图片

- `public/img/`：当前页面直接引用的 avatar、homepage portrait、post cover 等运行时图片。
- `public/assets/img/`：旧博客迁移遗留的 favicons 与正文内联图片。
- 当前两个图片目录是历史迁移结果，不是长期目标。
- 新页面级图片、cover、avatar 优先放 `public/img/`。
- 暂不主动迁移到 `src/assets/`；如果后续要用 Astro `<Image />` / `<Picture />`，先制定统一图片策略。

## 目录约定

- `src/pages/index.astro`：Homepage 数据装配与页面级 section 排布。
- `src/components/home/*`：Homepage 专用 section。
- `src/components/archive/*`：文章归档组件。
- `src/components/post/*`：单篇文章组件。
- `src/components/author/*`：跨页面作者组件，例如 `AuthorRail` / `AuthorStrip`。
- `src/styles/base.css`：全站基础元素与跨页面 UI，例如 nav、footer、route header、surface panel。
- `src/styles/prose.css`：Markdown 正文排版、数学公式、admonition、迁移文章需要的 prose helper。
- `src/lib/content.ts`：内容排序、链接、reading stats、tags。
- `src/lib/parseWorklog.ts`：公开 worklog thread 解析。
- `src/lib/gitActivity.ts`：build-time local git activity。
- `src/lib/tags.ts`：Homepage tag summary 与 tag tone。

## CSS / 实现规则

- 优先使用 Astro component-scoped `<style>`。
- 跨页面共享样式只放真正通用的 tokens/base/prose。
- 不使用 `!important` 作为常规手段。
- 避免 `:global()`；如必须跨组件布局，优先在父组件加语义 wrapper class。
- JS 动态生成且拿不到 Astro scope attribute 的节点，可以用 tightly rooted `:global([data-*] ...)`。
- 页面文件负责页面级 grid/section 排布；组件负责自己的内部样式。
- 不让页面级 CSS 深度选择组件内部 DOM。
- 移动端不是桌面缩小版，要按内容优先级重新排序。
- 手机端优先保留 Identity、Recent Writing、Current Thread、Marginalia。
- 需要交互时才加 client JS；默认保持静态 HTML。
- Client JS 预算只用于 reading progress、TOC scrollspy、lazy Giscus mount、Homepage writing preview 这类小交互。

## 验收基线

- 常规验证命令：
  - `docker compose run --rm site npm run build`
- 该命令应包含 `astro check` 与 `astro build`。
- 最近一次完整 build 通过：0 errors / 0 warnings / 0 hints。
- 最近检查过的关键路由：
  - `/`
  - `/posts/`
  - post detail
  - `/tags/`
  - tag detail
  - `/worklog/`
  - worklog detail
  - `/about/`
- 最近恢复 metadata 后新增 tag pages 返回 200：
  - `/tags/mae/`
  - `/tags/mse/`
  - `/tags/rmse/`
  - `/tags/r-squared/`
  - `/tags/ai-models/`
