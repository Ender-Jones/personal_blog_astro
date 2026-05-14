# Export Package — Codex Handoff

This folder is the handoff for the EnderJones personal site redesign (Astro + Cloudflare Pages). Everything Codex needs to implement v4 is here.

## Read in this order

1. **`CODEX_HANDOFF.md`** — the implementation contract. Project structure, full component list, frontmatter schemas, data file schemas, parser logic, acceptance checklist, what NOT to build. Start here.
2. **`Homepage Redesign.html`** — the canonical visual spec. Open in a browser to see the live design canvas with every artboard (homepage, archive, post page, cover-mode variants, Current Thread states, Selected Entry fallback states).
3. **`tokens.css`** — design tokens (colors, type, radii, spacing). Drop into `src/styles/tokens.css` in the Astro project.
4. **The four `.jsx` files** below — React/JSX prototypes that render the visual spec. Use them as **pixel reference**, not as code to port directly. Codex should rewrite each as Astro components per the structure in `CODEX_HANDOFF.md §1`.

## File map

| File | Role | Maps to (Astro) |
|---|---|---|
| `CODEX_HANDOFF.md` | implementation brief | — |
| `Homepage Redesign.html` | design canvas entry point | — |
| `tokens.css` | shared design tokens | `src/styles/tokens.css` |
| `homepage-designs.jsx` | shared atoms + `AuthorRail` + `AuthorStrip` | `src/components/author/*`, `src/components/ui/*` |
| `e-bento.jsx` | **homepage bento prototype** (`BentoArchive`) + state-variant artboards | `src/pages/index.astro` + `src/components/bento/*` |
| `archive-page.jsx` | archive page prototype with adaptive filters + AuthorRail | `src/pages/posts/index.astro` + `src/components/archive/*` |
| `post-detail.jsx` | single-post prototype with all 5 cover modes, TOC, reading progress, Giscus | `src/pages/posts/[...slug].astro` + `src/components/post/*` |

### Support files (not for export, but referenced by the prototypes)

- `design-canvas.jsx` — pan/zoom canvas component that hosts the artboards in `Homepage Redesign.html`. **Not part of the production site** — purely for viewing the prototypes side by side.
- `d-editorial.jsx` — older variant from earlier iterations. **Superseded; ignore.**
- `ang.JPG` — placeholder author portrait used by the prototypes. Replace with the real avatar in the Astro project (`src/assets/author/…`).
- `uploads/` — reference content from the user (sample post, sample worklog, atmospheric SCSS reference). Use to validate the parsers and content schemas against real input.

## What's in `homepage-designs.jsx` vs `e-bento.jsx`

Worth clarifying since the file names overlap:

- `homepage-designs.jsx` holds **shared atoms** used across every prototype: `DARK` palette, `FONT` constants, `POSTS` fixture, `SectionLabel`, `BlinkCursor`, plus the new `AuthorRail` / `AuthorStrip` components. It also still contains three early-exploration homepage variants (`QuietGrid`, `TerminalIndex`, `Atmospheric`) that are **not part of v4 final** — they're not referenced by `Homepage Redesign.html` and can be ignored.
- `e-bento.jsx` holds the **v4 homepage bento** (`BentoArchive`) plus the state-variant artboards (`CurrentThreadStates`, `SelectedEntryStates`). This is the canonical homepage prototype.

## Quick orientation for the implementer

- **Stack:** Astro 4+ static output → Cloudflare Pages. No SSR.
- **Content:** Markdown/MDX via Astro content collections (`posts`, `worklogs`). Schemas in `CODEX_HANDOFF.md §3`.
- **Client JS budget:** reading progress, TOC scrollspy, archive search (only at >12 posts), lazy Giscus mount. That's it.
- **No live widgets, no runtime API calls, no fake comments.** Everything is build-time data.
- **Five cover modes** for posts: `hero-large`, `hero-small`, `showcase`, `strip`, `none`. Defaults in `CODEX_HANDOFF.md §3`.
- **Current Thread** reads only from the worklog's `public_thread` frontmatter or `<!-- public:thread -->` block. Nothing else from the worklog body is ever surfaced on the homepage.
- **Selected Entry** resolves through a 5-tier fallback chain with build-time weekly rotation when 2+ entries qualify. Logic in `CODEX_HANDOFF.md §5`.
- **AuthorRail** is sticky on post/archive/worklog pages at ≥1024px. Mobile fallback is `AuthorStrip` near the footer.

## Open questions flagged for the implementer

See `CODEX_HANDOFF.md §15`. Short version: Giscus repo/category IDs, real GitHub handle, `/research` route decision, worklog index layout, RSS scope.

## Acceptance criteria

See `CODEX_HANDOFF.md §13`. A build is "done" when each item there passes.

---

**Total package size:** ~85 KB across 7 files (3 prototype JSX + 1 canvas HTML + 1 tokens CSS + 2 markdown). Self-contained — no external repo, no figma, no Notion.
