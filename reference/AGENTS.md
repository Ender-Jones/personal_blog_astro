# AGENTS.md

`reference/` 是只读参考资料区。

## 规则

- 不修改本目录内任何文件，除非用户明确要求。
- 不从这里直接搬运旧站代码到新 Astro 项目。
- 可以阅读、摘取设计意图、迁移内容或复制必要静态资产，但新站实现必须按 Astro 项目结构重写。

## 目录说明

- `claude_redesign/`
  - 主要设计来源。
  - `README_EXPORT.md` 和 `CODEX_HANDOFF.md` 是实现合同。
  - `Homepage Redesign.html` 是视觉规格参考。
  - JSX 文件是像素/结构原型，不是生产代码。
  - `tokens.css` 可作为新项目 `src/styles/tokens.css` 的来源。
- `old_blog/`
  - 旧博客完整复制。
  - 仅用于氛围、内容、头像/author presence、contact/social links、旧文章结构参考。
  - 不直接复刻旧站视觉，不搬 Jekyll/Chirpy 代码。

## 内容安全

- Worklog/reference 里的 raw notes 不自动展示到 homepage。
- Homepage Current Thread 只能使用 `public_thread` frontmatter 或 `public:thread:start/end` 标记内容。
- `noindex` 不是隐私保护；敏感内容应排除出构建/部署。

