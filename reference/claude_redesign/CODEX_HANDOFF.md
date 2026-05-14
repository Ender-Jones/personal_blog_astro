# Codex Handoff — EnderJones Personal Site

**Stack:** Astro 4+ · Cloudflare Pages · Markdown/MDX content collections · minimal client JS
**Design source of truth:** `Homepage Redesign.html` (renders the v4 prototypes — homepage bento, adaptive archive, post page with all 5 cover modes, AuthorRail, state variants for Current Thread and Selected Entry).

This brief is the implementation contract. Match the visuals from the prototype; match the data contracts below exactly.

---

## 1. Project structure

```
src/
├── content/
│   ├── config.ts                  # zod schemas — see §3
│   ├── posts/                     # MDX/MD posts
│   │   ├── 2025-04-28-who-am-i.md
│   │   └── …
│   └── worklogs/                  # MDX/MD monthly worklogs
│       ├── 2026-05.md
│       └── …
├── data/
│   ├── site.yml                   # author identity, socials, tile toggles
│   ├── research.yml               # current research focus
│   └── quotes.yml                 # marginalia rotation
├── components/
│   ├── layout/
│   │   ├── BaseLayout.astro
│   │   ├── Nav.astro
│   │   └── Footer.astro
│   ├── author/
│   │   ├── AuthorRail.astro       # sticky left rail (post/archive/worklog desktop)
│   │   └── AuthorStrip.astro      # compact horizontal (mobile / fallback)
│   ├── bento/
│   │   ├── BentoGrid.astro
│   │   ├── IdentityTile.astro
│   │   ├── ResearchNowTile.astro
│   │   ├── RecentWritingTile.astro
│   │   ├── CurrentThreadTile.astro
│   │   ├── SelectedEntryTile.astro
│   │   ├── TopicsTile.astro
│   │   ├── AboutTile.astro
│   │   ├── MarginaliaTile.astro
│   │   └── GithubTile.astro
│   ├── archive/
│   │   ├── ArchiveFilters.astro   # adapts to post count (§7)
│   │   ├── PostCard.astro
│   │   ├── PostListRow.astro
│   │   └── PinnedHero.astro
│   ├── post/
│   │   ├── Cover.astro            # switches on cover_mode — 5 variants
│   │   ├── PostHeader.astro
│   │   ├── PostMeta.astro
│   │   ├── TOC.astro              # desktop only, IntersectionObserver
│   │   ├── ReadingProgress.astro  # scroll listener, ~20 lines
│   │   ├── PrevNext.astro
│   │   └── Comments.astro         # lazy Giscus mount
│   └── ui/
│       ├── SectionLabel.astro
│       ├── TagChip.astro
│       ├── SourceBadge.astro
│       └── BlinkCursor.astro
├── lib/
│   ├── parseWorklog.ts            # extracts <!-- public:thread --> or public_thread frontmatter
│   ├── selectEntry.ts             # resolves Selected Entry fallback + weekly rotation
│   ├── tagAggregate.ts
│   ├── relativeTime.ts
│   └── isoWeek.ts                 # for deterministic rotation
├── pages/
│   ├── index.astro                # homepage bento
│   ├── posts/
│   │   ├── index.astro            # archive
│   │   └── [...slug].astro        # post detail
│   ├── worklog/
│   │   ├── index.astro            # worklog index (timeline)
│   │   └── [...slug].astro
│   ├── tags/[tag].astro
│   ├── about.astro
│   └── rss.xml.ts
├── styles/
│   ├── tokens.css                 # design tokens (§9)
│   ├── prose.css                  # post body
│   └── neon.css                   # atmosphere accents
└── public/
    └── github-contributions.json  # daily-refreshed snapshot from GH Action
```

---

## 2. Final component list

| Component | Page(s) | Purpose |
|---|---|---|
| `Nav` | all | top nav + lang + theme toggle |
| `Footer` | all | © + socials |
| `BentoGrid` | / | wraps the 12-col grid |
| `IdentityTile` | / | static avatar/name/role/socials |
| `ResearchNowTile` | / | thesis statement from `research.yml` |
| `RecentWritingTile` | / | top N posts with thumbnails |
| `CurrentThreadTile` | / | worklog public-thread excerpt |
| `SelectedEntryTile` | / | rotated selected/pinned/fallback post |
| `TopicsTile` | / | tag cloud |
| `AboutTile` | / | link to /about |
| `MarginaliaTile` | / | rotating quote |
| `GithubTile` | / | 26-week strip from cached JSON |
| `AuthorRail` | /posts, /posts/*, /worklog, /worklog/* | sticky left identity rail |
| `AuthorStrip` | mobile / footer | compact horizontal fallback |
| `ArchiveFilters` | /posts | adaptive search/tag/view toggle |
| `PostCard` / `PostListRow` / `PinnedHero` | /posts, /tags/[tag] | listing items |
| `Cover` | /posts/* | switches on `cover_mode` |
| `TOC` | /posts/* | desktop sticky TOC |
| `ReadingProgress` | /posts/* | top progress bar |
| `Comments` | /posts/* (opt-in) | lazy Giscus |

---

## 3. Frontmatter schemas

### `src/content/posts/*.md(x)`

```ts
const post = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),

  // Surfacing controls
  selected: z.boolean().default(false),   // eligible for Selected Entry rotation
  pinned:   z.boolean().default(false),   // gets archive magazine treatment + Selected Entry fallback
  comments: z.boolean().default(false),   // enable Giscus block

  // i18n
  language: z.enum(['en','zh']).default('en'),
  i18n_alt: z.string().optional(),        // slug of the alternate-language version

  // Cover system
  image: z.string().optional(),
  image_alt: z.string().optional(),
  image_role: z.enum(['mood','semantic','decorative']).default('mood'),
  image_focus: z.string().default('50% 50%'),   // CSS object-position
  image_credit: z.string().optional(),
  cover_mode: z.enum([
    'hero-large','hero-small','showcase','strip','inline','none',
  ]).optional(),
});
```

**Cover defaults (apply at render time when `cover_mode` omitted):**
- no `image` → `none`
- `image` set, no `cover_mode` → `hero-small`
- `pinned: true` + `image` → `hero-large`
- `showcase` is always opt-in — never auto-selected

### `src/content/worklogs/*.md(x)`

```ts
const worklog = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string().optional(),

  // Optional structured public summary — preferred over inline comment fence.
  public_thread: z.object({
    summary: z.string(),
    bullets: z.array(z.string()).max(4).default([]),
  }).optional(),

  // No `comments` field — schema rejects accidental enablement.
  // No `i18n_alt` either.
});
```

If `public_thread` frontmatter is absent, the parser falls back to looking for
a `<!-- public:thread:start --> … <!-- public:thread:end -->` block in the
body. **Nothing outside that block is ever surfaced on the homepage.**

**Truly sensitive worklogs:** keep the file out of `src/content/worklogs/`
entirely — don't rely on a `private: true` flag, since the site is built
and deployed. Local-only notes live outside the repo or in a separate,
git-ignored folder.

---

## 4. Data files

### `src/data/site.yml`

```yaml
name: EnderJones
role: PhD candidate
location: Tokyo, Japan
avatar: /img/author/ang.jpg
research_oneliner: Stress detection from multi-modal physiological signals.

socials:
  github:  https://github.com/enderjones
  twitter: https://twitter.com/enderjones
  email:   mailto:hi@example.com
  rss:     /feed.xml

# Homepage tile feature flags
tiles:
  github: true
  marginalia: true
  weather: false        # not implemented in v4
```

### `src/data/research.yml`

```yaml
focus: Stress detection from multi-modal physiological signals.
abstract: |
  Reproducing CCT-LSTM on BP4D++ with EDA augmentation; exploring 3-class
  severity classification and visual–physiological fusion. Considering
  VLM/LLM directions for emotion recognition next.
tags:
  - affective computing
  - multi-modal DL
  - vision transformers
  - stress detection
  - VLM/LLM
updated: 2026-05-01
stale_after_days: 180   # tile collapses to soft prompt past this
```

### `src/data/quotes.yml`

```yaml
- text: « J'aime les nuages… les nuages qui passent… là-bas… les merveilleux nuages ! »
  source: Baudelaire
  work: L'Étranger
  year: 1869
- text: …
```

Rotation: `quotes[hash(buildDate) % quotes.length]` — deterministic per build.

### `public/github-contributions.json`

Refreshed by a GitHub Action (`.github/workflows/refresh-github.yml`,
`schedule: '0 3 * * *'`). Schema:

```json
{
  "user": "enderjones",
  "snapshot_date": "2026-05-13",
  "total_last_year": 412,
  "total_last_26w": 182,
  "weeks": [
    { "start": "2025-11-17", "days": [0, 1, 3, 0, 2, 1, 0] },
    …
  ]
}
```

If the file is older than 3 days, the tile still renders the cached strip
plus a small `snapshot from {date}` line — no runtime API call.

---

## 5. Selected Entry — resolution + rotation

`lib/selectEntry.ts` exports `resolveSelectedEntry(posts, weekOfYear)`.

```ts
function resolveSelectedEntry(posts, weekOfYear) {
  // Tier 1: explicit selected: true (can be many → rotate weekly)
  const selectedPool = posts.filter(p => p.data.selected);
  if (selectedPool.length > 0) {
    const sorted = selectedPool.sort((a,b) => a.slug.localeCompare(b.slug));
    return { entry: sorted[weekOfYear % sorted.length], variant: 'selected' };
  }
  // Tier 2: pinned: true (typically 1, but rotate if many)
  const pinnedPool = posts.filter(p => p.data.pinned);
  if (pinnedPool.length > 0) {
    const sorted = pinnedPool.sort((a,b) => a.slug.localeCompare(b.slug));
    return { entry: sorted[weekOfYear % sorted.length], variant: 'pinned' };
  }
  // Tier 3: who-am-i fallback
  const whoami = posts.find(p => p.slug === 'who-am-i');
  if (whoami) return { entry: whoami, variant: 'startHere' };
  // Tier 4: latest post
  const latest = [...posts].sort((a,b) => b.data.date - a.data.date)[0];
  if (latest) return { entry: latest, variant: 'latest' };
  // Tier 5: research thesis card
  return { entry: null, variant: 'research' };
}
```

**`weekOfYear`** is computed at build time from `new Date()` via `lib/isoWeek.ts`. Build-time deterministic, no client JS, no `localStorage`. First impression is always stable (selected/pinned). Rotation only kicks in when 2+ entries qualify in the same tier.

---

## 6. Current Thread — worklog parser

`lib/parseWorklog.ts` exports `getCurrentThread()`:

```ts
function getCurrentThread() {
  const latest = getLatestWorklog();   // most recent by date
  if (!latest) return { state: 'collapsed', reason: 'no-worklog' };

  // Prefer structured frontmatter
  if (latest.data.public_thread) {
    return {
      state: stalenessState(latest.data.updated || latest.data.date),
      worklog: latest,
      summary: latest.data.public_thread.summary,
      bullets: latest.data.public_thread.bullets,
    };
  }

  // Fallback: inline comment fence
  const match = latest.body.match(
    /<!-- public:thread:start -->([\s\S]*?)<!-- public:thread:end -->/
  );
  if (!match) return { state: 'collapsed', reason: 'no-public-block', worklog: latest };

  const { summary, bullets } = parsePublicBlock(match[1]);
  return {
    state: stalenessState(latest.data.updated || latest.data.date),
    worklog: latest,
    summary,
    bullets,
  };
}

function stalenessState(dateLike) {
  const days = daysSince(dateLike);
  if (days <= 14) return 'normal';
  if (days <= 45) return 'stale';
  return 'collapsed';
}
```

**`CurrentThreadTile.astro` renders:**
- `state: normal` — full tile with headline, bullets, blue accent.
- `state: stale` — same tile with an amber footer pill: "thread is getting old — add an entry".
- `state: collapsed` — single-line nudge: "Last worklog: {date}. No public thread — append a new entry to refresh."

Three states drawn in the `current-thread-states` artboard.

**Important wording:** never call non-surfaced content "private". Use "raw working notes" / "not surfaced on homepage" / "not used for homepage summaries". The full worklog page (`/worklog/[slug]`) still renders the entire markdown body — that content is public, just not summarized.

---

## 7. Archive adaptive behavior

`ArchiveFilters.astro` accepts `total: number` and renders one of:

| Condition | UI |
|---|---|
| `total ≤ 3` | tag chips only, no search bar, list-default |
| `4 ≤ total ≤ 12` | tag chips + collapsed search icon (`⌕` button, ⌘K expands) + view toggle, list-default |
| `total > 12` | full search input + tag chips + view toggle, cards-default |

Other rules:
- Only tags with ≥ 1 post are shown.
- Year groups suppress years with zero posts.
- Only **one** post gets the magazine `PinnedHero` treatment per year, even with multiple `pinned: true` posts (sort by date desc, take first).
- Empty filter result: "No posts under #tag yet — try #other-tag" with adjacent-tag suggestion.

---

## 8. Comments (Giscus)

Default: **Giscus**, GitHub-login backed by GitHub Discussions on the site repo.

```astro
---
// src/components/post/Comments.astro
const { slug } = Astro.props;
---
<section class="comments" data-slug={slug}>
  <h2>Comments</h2>
  <div id="giscus-mount"></div>
</section>
<script>
  // Lazy mount when scrolled within 600px
  const mount = document.getElementById('giscus-mount');
  const obs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    obs.disconnect();
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.setAttribute('data-repo', 'enderjones/blog');
    s.setAttribute('data-repo-id', '…');
    s.setAttribute('data-category', 'Comments');
    s.setAttribute('data-category-id', '…');
    s.setAttribute('data-mapping', 'pathname');
    s.setAttribute('data-theme', '/giscus-theme.css');
    s.setAttribute('data-lang', 'en');
    s.crossOrigin = 'anonymous';
    s.async = true;
    mount.appendChild(s);
  }, { rootMargin: '600px' });
  obs.observe(mount);
</script>
```

**Rules:**
- `comments: false` is the default for all posts.
- Posts opt in per-file with `comments: true`.
- Worklogs schema doesn't accept the field at all — no opt-in path.
- The component is not mounted at all when `comments !== true` — zero JS impact for quiet posts.
- Style via `/giscus-theme.css` to match site palette (dark surface, muted borders, no glow).

**Alternatives, for future consideration only:**
- **Utterances** — simpler GitHub-Issues-based comments. Switch is a small component swap.
- **Cusdis** — non-GitHub, lightweight; adds spam moderation + self-host or service dependency. Defer unless GitHub-only login becomes a barrier.

---

## 9. CSS tokens (`src/styles/tokens.css`)

```css
:root {
  /* Surfaces */
  --bg:           #070809;
  --surface:      #0e1014;
  --surface-hi:   #141820;
  --border:       rgba(255,255,255,0.06);
  --border-hi:    rgba(255,255,255,0.12);

  /* Text */
  --text:         #f1f3f5;
  --text-muted:   #8b95a1;
  --text-dim:     #6b7785;

  /* Accents (use sparingly — see neon rules below) */
  --accent-pink:    #f472b6;  /* identity, marginalia, "selected" */
  --accent-blue:    #38bdf8;  /* writing, worklog, code */
  --accent-green:   #34d399;  /* research only */
  --accent-purple:  #a78bfa;  /* reserved — currently unused on homepage */
  --accent-amber:   #f59e0b;  /* staleness warning only */

  /* Type */
  --font-sans:    'Noto Sans', system-ui, sans-serif;
  --font-mono:    'Fira Code', ui-monospace, monospace;
  --font-serif:   'Georgia', 'Source Serif Pro', serif;

  /* Radii */
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;
  --r-xl: 18px;

  /* Spacing scale (4px base) */
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px;  --s-4: 16px;
  --s-5: 20px; --s-6: 24px; --s-8: 32px;  --s-10: 40px;
  --s-12: 48px; --s-16: 64px; --s-20: 80px;
}
```

**Neon discipline:**
- `text-shadow` glow is reserved for: blink cursor, reading progress bar, active TOC dot, section-label color on key tiles. **Never on body copy.**
- Max two accent colours per visible area.
- Amber is only for staleness warnings — not a decorative accent.
- Purple is intentionally unused on the homepage; reserve for future page (e.g. `/research`).

---

## 10. AuthorRail / AuthorStrip

Rendered on `/posts`, `/posts/*`, `/worklog`, `/worklog/*` at ≥ 1024px.
Below 1024px, swap to `AuthorStrip` placed near the footer.

Layout on post pages: `200px AuthorRail | 1fr article | 200px TOC`, 40px gap.
Layout on archive: `200px AuthorRail | 1fr listings`, 56px gap.

Reads entirely from `data/site.yml`. The optional `currentThread` line on the rail is the same one-line summary the `CurrentThreadTile` would render — if `state: collapsed`, omit the section, don't draw a placeholder.

Homepage uses the `IdentityTile` instead — never both.

---

## 11. Reading-page details

- Sticky `TOC` only ≥ 1024px. Mobile: `<details>` disclosure at the top of the body.
- `ReadingProgress` is a fixed 2px bar at the top. Pure scroll listener.
- `Comments` lazy-mounted via `IntersectionObserver` with `rootMargin: '600px'`.
- Code blocks: use Astro's built-in Shiki (theme: `github-dark` or `one-dark-pro`). Real copy button via `navigator.clipboard`.
- Marginalia pull-quote: serif italic, 3px pink left border, no glow.
- `prev`/`next` cross-links from collection order. Hide block when neighbours don't exist.

---

## 12. Build / deploy

- **Astro adapter:** none required for static-only output on Cloudflare Pages.
- **Output:** `output: 'static'` in `astro.config.mjs`.
- **Cloudflare Pages build:** `npm run build`, publish `dist/`.
- **GitHub Action for contributions snapshot:** writes to `public/github-contributions.json`, commits, triggers a Cloudflare Pages rebuild.
- **No runtime API calls** from the page itself. All data lives in the build.

---

## 13. Acceptance checklist

A v4 build is "done" when:

- [ ] Homepage renders matching `Homepage Redesign.html → ① Homepage` artboard with real content.
- [ ] All 4 P0 tiles (Identity, Research Now, Recent Writing, Current Thread) render correctly with the supplied sample posts and worklog.
- [ ] `Current Thread` shows `normal` state when the public block exists; collapses gracefully when it doesn't (verified by removing the block from the test worklog).
- [ ] `Selected Entry` resolves through all five tiers, demonstrated by manipulating frontmatter (`selected: true` → remove → leave only `pinned` → remove → only `who-am-i` exists → remove → only latest → remove all posts).
- [ ] Archive page adapts visibly at `total = 3`, `total = 6`, `total = 13` (test with stubbed posts).
- [ ] All 5 cover modes render correctly: visit a test post with each `cover_mode` value.
- [ ] `showcase` mode displays the image in its full composition (max-width 960, max-height 560, `object-fit: contain`), not as a backdrop.
- [ ] `AuthorRail` is sticky on post + archive pages at ≥ 1024px, swaps to `AuthorStrip` at smaller widths.
- [ ] `comments: true` posts mount Giscus lazily; `comments: false` (or missing) posts include no comments script.
- [ ] Worklog detail page renders full markdown body. Homepage tile only ever surfaces the public block.
- [ ] No console errors. No runtime API calls. No fake live widgets.
- [ ] Lighthouse: ≥ 95 on Performance, Accessibility, Best Practices for `/`, `/posts/`, `/posts/who-am-i`.

---

## 14. What NOT to build

- Weather tile (deprioritized; component is not in the v4 component list).
- Daily todo as a separate tile (folded into Current Thread).
- Anonymous comment system, name/email-based forms, embedded reactions.
- Live status indicators (online/offline, "now playing", live clock).
- Per-post bespoke colour overrides, custom fonts, or per-post layout switches beyond the documented frontmatter.
- A separate route for the state-variant artboards — they live only in the design prototype.
- Multi-locale routing engine. `i18n_alt` is just a slug pointer to a sibling post.

---

## 15. Open questions for the user

Not blockers — flag during PR review:

1. **Giscus repo/category IDs.** Need real values to wire `Comments.astro`.
2. **GitHub username for the contributions Action.** Confirm `enderjones` is the handle.
3. **Worklog index page treatment.** Currently planned as a vertical timeline. Confirm vs. a card grid.
4. **`/research` page.** Not scoped here, but `ResearchNowTile` links there — either build a stub or remove the link until ready.
5. **RSS scope.** Posts only, or include public-thread excerpts from worklogs? Default: posts only.

---

**End of brief.** The prototype HTML is the canonical visual spec; this document is the canonical data + structural spec. Match both.
