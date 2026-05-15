// ============================================
// HOMEPAGE v5 — EDITORIAL NOTEBOOK · r5
//
// Big changes from r4:
//
// 1. Current Thread tile redesigned for low-maintenance.
//    Sources are ONLY: parseWorklog → public_thread.{summary, bullets, updated} +
//    auto entry / word counts. No artificial timeline. No checklist with manual
//    statuses. Just the markdown excerpt, presented beautifully.
//
// 2. §01 right column reimagined as editorial notebook-index cards:
//    – "The Thesis" — frontispiece treatment for Research·Now (HR + first-time
//      visitor friendly: scannable, big serif title, classification line).
//    – "In the margins" — Current Thread as a softer marginal note.
//
// 3. Post rail is now a vertical SCROLL DRUM. Max ~5 items visible; the item
//    nearest the rail's vertical center is the active preview. Scroll changes
//    active. Click any item scroll-snaps it to center. Hover hint is gone.
//    Items decay in opacity by distance from center for the drum feel.
//    Preview image + title key-remount + fade-in animation on swap.
//
// 4. §02 is flipped: rail (1fr) is LEFT — narrow drum.
//    Preview (1.65fr) is RIGHT — wide magazine card.
//
// 5. §03 stacked layout: full-width Current Thread card on top,
//    GitHub + Topics side-by-side below.
//
// 6. Topics → dot-leader tag index. All 9 tags listed, colored by category,
//    counts right-aligned with dotted leaders between. Beautiful AND functional.
//
// 7. §04 Marginalia full-width, big serif treatment.
//    Contact becomes a slim icon pill row in the footer.
//
// 8. Section headers softened — "updated" info passive, no dashboard nag.
// ============================================

// ────────────────────────────────────────────────────────
// shared atoms
// ────────────────────────────────────────────────────────

const HomeTile = ({ children, accent = DARK.border, glow, style = {}, source, sourceLabel,
  onMouseEnter, onClick }) => (
  <div onMouseEnter={onMouseEnter} onClick={onClick}
    style={{ position: 'relative', borderRadius: 14, overflow: 'hidden',
      border: '1px solid ' + accent, background: DARK.surface,
      boxShadow: glow ? `0 0 28px ${glow}, inset 0 1px 0 rgba(255,255,255,0.04)`
        : 'inset 0 1px 0 rgba(255,255,255,0.04)',
      ...style }}>
    {source && (
      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 5, opacity: 0.55 }}>
        <HomeSource kind={source} label={sourceLabel} />
      </div>
    )}
    {children}
  </div>
);

const HomeSource = ({ kind, label }) => {
  const colors = {
    static:   { bg: 'rgba(148,163,184,0.07)', fg: 'rgba(166,173,182,0.85)', dot: DARK.muted },
    auto:     { bg: 'rgba(56,189,248,0.07)',  fg: 'rgba(125,211,252,0.95)', dot: DARK.blue },
    data:     { bg: 'rgba(167,139,250,0.07)', fg: 'rgba(196,181,253,0.95)', dot: DARK.purple },
  };
  const c = colors[kind] || colors.static;
  return (
    <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center',
      padding: '3px 9px', borderRadius: 4, background: c.bg,
      fontSize: 10, color: c.fg, fontFamily: FONT.mono, letterSpacing: '0.06em' }}>
      <NavDot color={c.dot} size={4} />
      <span>{label}</span>
    </div>
  );
};

// ────────────────────────────────────────────────────────
// content sources (low-maintenance contracts)
// ────────────────────────────────────────────────────────

// All 6 posts — same shape used everywhere on this page.
const HOME_POSTS = [
  { slug: 'what-distance-taught-us',
    title: 'What Distance Taught Us',
    date: '2026.05.07', dateShort: 'May 07', year: '2026',
    tags: ['poem','memory'], readTime: '4 min',
    excerpt: 'A short poem on seasons, distance, and memory — written between two cities, on the train home from the lab at 2am.',
    img: POST_IMAGES.poem },
  { slug: 'eda-augmentation-notes',
    title: 'Notes on EDA Signal Augmentation for Stress',
    date: '2026.03.18', dateShort: 'Mar 18', year: '2026',
    tags: ['research','EDA'], readTime: '7 min',
    excerpt: 'Lessons from trying random-crop, mixup, and time-warp on EDA windows. Most of it does not transfer cleanly; what worked, and why.',
    img: POST_IMAGES.regression },
  { slug: 'vit-affect-reading',
    title: 'Reading: Vision Transformers for Affect Recognition',
    date: '2026.02.05', dateShort: 'Feb 05', year: '2026',
    tags: ['paper-notes','vision'], readTime: '6 min',
    excerpt: 'Weekly digest of three papers on ViT for affective computing. The one I keep returning to is the smallest of the bunch.',
    img: POST_IMAGES.ai },
  { slug: 'prompt-engineering-takes',
    title: 'Prompt Engineering & Major Model Takes',
    date: '2025.09.01', dateShort: 'Sep 01', year: '2025',
    tags: ['AI'], readTime: '9 min',
    excerpt: 'Practical prompt patterns and side-by-side notes on the major models, written after a season of using them in real research workflows.',
    img: POST_IMAGES.ai },
  { slug: 'regression-metrics',
    title: 'Regression Model Evaluation Metrics',
    date: '2025.05.08', dateShort: 'May 08', year: '2025',
    tags: ['AI','ML'], readTime: '12 min',
    excerpt: 'MAE, MSE, RMSE, and R² — what each one is sensitive to, when they agree, and when you should worry that they don\'t.',
    img: POST_IMAGES.regression },
  { slug: 'who-am-i',
    title: 'Who Am I?',
    date: '2025.04.29', dateShort: 'Apr 29', year: '2025',
    tags: ['blogging'], readTime: '8 min',
    excerpt: 'A kid wanted to be a scientist, but lost precious things on the road. The closest thing to a personal introduction on this site.',
    img: POST_IMAGES.whoami, pinned: true, lang: 'zh' },
];

// What the Current Thread tile parses from `worklogs/<latest>.md`.
// Schema mirrors CODEX_HANDOFF §3.2 — parseWorklog → public_thread.
const PUBLIC_THREAD = {
  summary: 'EDA-augmented stress classification, paper iteration round 2. The CCT-LSTM core run is in; the next pass is about whether BP4D++ labels can actually carry the severity story I want to tell.',
  bullets: [
    'CCT-LSTM evaluation, round 2',
    'BP4D++ stress-label limitation review',
    'VLM / LLM emotion-recognition direction',
  ],
  updated: '2026.05.09',
  source: 'worklogs/2026-05.md',
  // auto-derived from the whole worklog corpus — same contract as the
  // archive page's `tagAggregate`. Cheap to compute at build time.
  stats: { entries: 14, words: 9840, lastTouched: '4d ago' },
};

// Single tags index — colored by category.
const TOPICS = [
  { tag: 'AI',               count: 12, color: 'blue' },
  { tag: 'machine-learning', count:  8, color: 'blue' },
  { tag: 'research',         count:  6, color: 'green' },
  { tag: 'paper-notes',      count:  4, color: 'blue' },
  { tag: 'blogging',         count:  4, color: 'pink' },
  { tag: 'evaluation',       count:  3, color: 'blue' },
  { tag: 'poem',             count:  2, color: 'pink' },
  { tag: 'memory',           count:  2, color: 'pink' },
  { tag: 'others',           count:  5, color: 'muted' },
];

const TAG_COLOR = {
  blue:  DARK.blue,
  green: DARK.green,
  pink:  DARK.pink,
  muted: DARK.muted,
};

// ============================================
// MAIN
// ============================================
function EditorialHome() {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const railRef = React.useRef(null);
  const railInitialized = React.useRef(false);
  const active = HOME_POSTS[activeIdx];
  const pad = 80;

  // Track the rail item nearest the vertical center → active.
  const updateActiveFromScroll = React.useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const items = el.querySelectorAll('[data-rail-idx]');
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    let bestIdx = 0, bestDist = Infinity;
    items.forEach((item) => {
      const r = item.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = parseInt(item.getAttribute('data-rail-idx'), 10);
      }
    });
    setActiveIdx(bestIdx);
  }, []);

  React.useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateActiveFromScroll();
          ticking = false;
        });
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    // First-paint snap: ensure idx 0 is centered.
    if (!railInitialized.current) {
      const first = el.querySelector('[data-rail-idx="0"]');
      if (first) first.scrollIntoView({ block: 'center', inline: 'nearest' });
      railInitialized.current = true;
    }
    return () => el.removeEventListener('scroll', onScroll);
  }, [updateActiveFromScroll]);

  const focusRailIdx = (idx) => {
    const el = railRef.current;
    if (!el) return;
    const target = el.querySelector('[data-rail-idx="' + idx + '"]');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  };

  return (
    <div style={{ width: 1440, minHeight: 2560, background: DARK.bg, fontFamily: FONT.sans,
      color: DARK.text, position: 'relative', overflow: 'hidden' }}>

      {/* ── keyframes (scoped via prefix) ─────────────────── */}
      <style>{`
        @keyframes ej-preview-fade {
          from { opacity: 0; transform: translateY(6px); filter: blur(2px); }
          to   { opacity: 1; transform: translateY(0);   filter: blur(0); }
        }
        @keyframes ej-img-fade {
          from { opacity: 0.55; transform: scale(1.015); filter: brightness(0.68) saturate(0.86); }
          to   { opacity: 1;    transform: scale(1);      filter: brightness(0.82) saturate(0.92); }
        }
        @keyframes ej-pulse-soft {
          0%, 100% { opacity: 0.9; }
          50%      { opacity: 0.35; }
        }
        .ej-rail::-webkit-scrollbar { width: 0; }
        .ej-rail { scrollbar-width: none; }
      `}</style>

      {/* ── atmosphere ────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(to right, rgba(148,163,184,0.018) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.018) 1px, transparent 1px),
          radial-gradient(800px 550px at 14% 8%, rgba(244,114,182,0.06), transparent 60%),
          radial-gradient(750px 500px at 90% 28%, rgba(56,189,248,0.045), transparent 60%),
          radial-gradient(700px 600px at 50% 80%, rgba(167,139,250,0.03), transparent 60%)`,
        backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%, 100% 100%' }} />

      {/* ── nav ───────────────────────────────────────────── */}
      <nav style={{ position: 'relative', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '0 ' + pad + 'px', height: 64 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, letterSpacing: '0.02em' }}>
          EnderJones<BlinkCursor color={DARK.pink} />
        </span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {['Posts','Tags','Worklog','About'].map((item, i) => (
            <span key={i} style={{ fontSize: 12, color: DARK.mutedLight, fontFamily: FONT.mono,
              letterSpacing: '0.02em' }}>{item}</span>
          ))}
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }}></div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '3px 9px',
            borderRadius: 5, background: 'rgba(15,18,22,0.5)',
            border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: 11, color: DARK.blue, fontFamily: FONT.mono, fontWeight: 600 }}>EN</span>
            <span style={{ fontSize: 11, color: DARK.muted }}>·</span>
            <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>中</span>
          </div>
          <span style={{ fontSize: 12, color: DARK.amber }}>☾</span>
        </div>
      </nav>

      {/* ── archive number strip ─────────────────────────── */}
      <div style={{ position: 'relative', padding: '36px ' + pad + 'px 0' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 24, height: 1, background: DARK.pink }}></div>
          <SectionLabel color={DARK.pink}>Personal Archive · № 01 · Est. 2025 · Tokyo</SectionLabel>
          <div style={{ flex: 1, height: 1,
            background: 'linear-gradient(90deg, rgba(244,114,182,0.22), transparent)' }}></div>
          <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
            letterSpacing: '0.06em' }}>
            {HOME_POSTS.length} posts · {TOPICS.length} tags · 1 worklog
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          §01 — FIRST IMPRESSION
          Hero (1.65fr) · Thesis + Margins (1fr stack)
          ════════════════════════════════════════════════════════ */}

      <section style={{ position: 'relative', padding: '32px ' + pad + 'px 56px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr',
          gridAutoRows: '256px', gap: 16 }}>

          {/* ─── HERO (LEFT, spans 2 rows) ─── */}
          <HeroTile />

          {/* ─── THESIS (top right) — frontispiece ─── */}
          <ThesisTile />

          {/* ─── IN THE MARGINS (bottom right) — marginal note ─── */}
          <MarginsTile />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          §02 — WRITING SURFACE
          Drum rail (LEFT, narrow) · Preview (RIGHT, wide)  ← FLIPPED
          ════════════════════════════════════════════════════════ */}

      <section style={{ position: 'relative', padding: '16px ' + pad + 'px 36px' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 16 }}>
          <SectionLabel color={DARK.pink}>§ 02 · writing</SectionLabel>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400,
            color: '#fff', fontStyle: 'italic', letterSpacing: '-0.005em' }}>
            essays, paper notes, the occasional poem.
          </span>
          <div style={{ flex: 1, height: 1,
            background: 'linear-gradient(90deg, rgba(244,114,182,0.2), transparent 75%)' }}></div>
          <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>
            ↳ {HOME_POSTS.length} posts · scroll to preview
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.65fr', gap: 16,
          alignItems: 'stretch', minHeight: 340 }}>
          {/* Tighter §02 row — keeps the home page from sprawling on 16:10
              displays. preview image is 21:8 cinematic; rail content (6×92 +
              padding 152 each side) still exceeds the ~396px viewport, so the
              drum scrolls. */}

          {/* ─── DRUM RAIL · LEFT (narrow) ─── */}
          <HomeTile accent="rgba(56,189,248,0.18)"
            source="auto" sourceLabel="auto · scroll-snap">

            <div style={{ position: 'relative', height: '100%',
              display: 'flex', flexDirection: 'column' }}>

              {/* header */}
              <div style={{ padding: '14px 22px 10px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <SectionLabel color={DARK.blue}>↳ Post rail</SectionLabel>
                <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
                  {String(activeIdx + 1).padStart(2, '0')}<span style={{ color: 'rgba(255,255,255,0.15)' }}> / </span>
                  {String(HOME_POSTS.length).padStart(2, '0')}
                </span>
              </div>

              {/* drum window — fade masks top + bottom */}
              <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>

                {/* center indicator line */}
                <div style={{ position: 'absolute', left: 18, right: 18,
                  top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: DARK.blue,
                      boxShadow: '0 0 8px ' + DARK.blue, flexShrink: 0 }}></div>
                    <div style={{ flex: 1, height: 1,
                      background: 'linear-gradient(90deg, rgba(56,189,248,0.5), rgba(56,189,248,0.08) 90%)' }}></div>
                    <span style={{ fontSize: 9, color: DARK.blue, fontFamily: FONT.mono,
                      letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>now</span>
                  </div>
                </div>

                {/* top fade */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 64,
                  background: 'linear-gradient(180deg, ' + DARK.surface + ' 0%, transparent 100%)',
                  pointerEvents: 'none', zIndex: 3 }}></div>
                {/* bottom fade */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
                  background: 'linear-gradient(0deg, ' + DARK.surface + ' 0%, transparent 100%)',
                  pointerEvents: 'none', zIndex: 3 }}></div>

                {/* the actual scroll list */}
                <ol ref={railRef} className="ej-rail"
                  style={{ listStyle: 'none', margin: 0,
                    padding: '110px 0 110px', /* lets first/last item reach center */
                    height: '100%', overflowY: 'auto',
                    scrollSnapType: 'y mandatory',
                    scrollBehavior: 'auto' }}>

                  {HOME_POSTS.map((p, i) => {
                    const dist = Math.abs(i - activeIdx);
                    const isActive = dist === 0;
                    const opacity = isActive ? 1
                                   : dist === 1 ? 0.6
                                   : dist === 2 ? 0.32
                                                : 0.18;
                    const scale = isActive ? 1 : 1 - Math.min(dist, 3) * 0.04;
                    return (
                      <li key={p.slug}
                        data-rail-idx={i}
                        onClick={() => focusRailIdx(i)}
                        style={{ scrollSnapAlign: 'center',
                          padding: '12px 22px',
                          minHeight: 74,
                          cursor: 'pointer',
                          opacity, transform: 'scale(' + scale + ')',
                          transformOrigin: 'left center',
                          transition: 'opacity 0.32s ease, transform 0.32s ease',
                          display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                        <div style={{ display: 'grid',
                          gridTemplateColumns: '54px 1fr auto',
                          gap: 14, alignItems: 'flex-start' }}>

                          {/* date column */}
                          <div style={{ paddingTop: 2 }}>
                            <div style={{ fontSize: 11, color: isActive ? DARK.blue : DARK.muted,
                              fontFamily: FONT.mono, fontWeight: 600, letterSpacing: '0.02em' }}>
                              {p.dateShort}
                            </div>
                            <div style={{ fontSize: 9.5, color: DARK.muted, fontFamily: FONT.mono,
                              marginTop: 3, opacity: 0.75 }}>
                              {p.year}
                            </div>
                          </div>

                          {/* title + tags */}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 15,
                              color: isActive ? '#fff' : 'rgba(255,255,255,0.92)',
                              lineHeight: 1.35,
                              fontWeight: isActive ? 600 : 500, textWrap: 'pretty',
                              display: 'flex', gap: 8, alignItems: 'baseline' }}>
                              {p.pinned && <span style={{ color: DARK.pink, fontSize: 11, flexShrink: 0 }}>★</span>}
                              <span>{p.title}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                              {p.tags.slice(0, 2).map((t, j) => (
                                <span key={j} style={{ fontSize: 9.5,
                                  color: isActive ? DARK.mutedLight : DARK.muted,
                                  fontFamily: FONT.mono,
                                  padding: '1px 7px', borderRadius: 3,
                                  background: isActive ? 'rgba(56,189,248,0.06)' : 'transparent',
                                  border: '1px solid ' + (isActive ? 'rgba(56,189,248,0.18)' : 'transparent') }}>
                                  #{t}
                                </span>
                              ))}
                              {p.lang === 'zh' && (
                                <span style={{ fontSize: 10, color: DARK.blue, fontFamily: FONT.mono }}>中</span>
                              )}
                              <span style={{ fontSize: 9.5, color: DARK.muted,
                                fontFamily: FONT.mono, marginLeft: 'auto' }}>
                                {p.readTime}
                              </span>
                            </div>
                          </div>

                          {/* active marker */}
                          <span style={{ alignSelf: 'center',
                            fontSize: 12, color: isActive ? DARK.blue : 'transparent',
                            fontFamily: FONT.mono,
                            transition: 'color 0.32s' }}>
                            ●
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* footer */}
              <div style={{ padding: '10px 22px 12px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
                  letterSpacing: '0.04em' }}>
                  ⇅ scroll · or click
                </span>
                <span style={{ fontSize: 12, color: DARK.blue, fontFamily: FONT.mono,
                  display: 'flex', alignItems: 'center', gap: 6 }}>
                  all writing<span>→</span>
                </span>
              </div>
            </div>
          </HomeTile>

          {/* ─── PREVIEW · RIGHT (wide magazine) ─── */}
          <HomeTile accent={activeIdx === 0 ? "rgba(244,114,182,0.22)" : "rgba(56,189,248,0.2)"}
            glow={activeIdx === 0 ? "rgba(244,114,182,0.05)" : "rgba(56,189,248,0.04)"}
            source="auto"
            sourceLabel={activeIdx === 0 ? 'pinned + latest' : 'preview · from the rail'}
            style={{ transition: 'border-color 0.32s, box-shadow 0.32s' }}>

            <div style={{ position: 'relative', aspectRatio: '21 / 6', overflow: 'hidden' }}>
              <img key={'img-' + active.slug} src={active.img} alt={active.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'brightness(0.82) saturate(0.92)',
                  animation: 'ej-img-fade 0.5s ease-out' }} />
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(7,8,9,0.18) 0%, rgba(7,8,9,0.88) 100%)' }}></div>

              {/* badge */}
              <div style={{ position: 'absolute', top: 16, left: 18,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 999,
                fontSize: 10.5, fontFamily: FONT.mono,
                color: activeIdx === 0 ? DARK.pink : DARK.blue,
                background: 'rgba(7,8,9,0.6)', backdropFilter: 'blur(8px)',
                border: activeIdx === 0
                  ? '1px solid rgba(244,114,182,0.32)'
                  : '1px solid rgba(56,189,248,0.32)',
                letterSpacing: '0.06em', transition: 'all 0.32s' }}>
                <span>{activeIdx === 0 ? '★' : '↳'}</span>
                <span>{activeIdx === 0 ? 'Featured · this week' : 'Preview · from the rail'}</span>
              </div>

              <div style={{ position: 'absolute', bottom: 14, right: 20,
                fontSize: 11, fontFamily: FONT.mono, color: 'rgba(255,255,255,0.88)',
                letterSpacing: '0.04em', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
                {active.date} · {active.readTime}
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 20, display: 'flex', gap: 8 }}>
                {active.tags.map((t, i) => (
                  <span key={i} style={{ fontSize: 10, color: '#fff', fontFamily: FONT.mono,
                    padding: '2px 9px', borderRadius: 999,
                    background: 'rgba(7,8,9,0.55)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.12)' }}>#{t}</span>
                ))}
                {active.lang === 'zh' && (
                  <span style={{ fontSize: 10, color: DARK.blue, fontFamily: FONT.mono,
                    padding: '2px 9px', borderRadius: 999,
                    background: 'rgba(7,8,9,0.55)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(56,189,248,0.25)' }}>中文 available</span>
                )}
              </div>
            </div>

            {/* preview body — fades in on key swap */}
            <div key={'body-' + active.slug}
              style={{ padding: '14px 28px 14px',
                animation: 'ej-preview-fade 0.42s ease-out' }}>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, lineHeight: 1.15,
                letterSpacing: '-0.018em', color: '#fff', textWrap: 'balance' }}>
                {active.title}
              </h2>

              <p style={{ fontFamily: 'Georgia, serif', fontSize: 14.5, color: DARK.mutedLight,
                margin: '10px 0 0', lineHeight: 1.5, fontWeight: 300,
                textWrap: 'pretty', maxWidth: 660, fontStyle: 'italic',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden' }}>
                {active.excerpt}
              </p>

              <div style={{ marginTop: 12, paddingTop: 12,
                borderTop: '1px dashed rgba(255,255,255,0.07)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center',
                  fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>
                  <span>posts/{active.slug}/</span>
                  {active.pinned && (
                    <>
                      <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                      <span style={{ color: DARK.pink }}>★ pinned</span>
                    </>
                  )}
                </div>

                <button onClick={() => {}}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10,
                    padding: '6px 15px', borderRadius: 999,
                    background: 'linear-gradient(135deg, rgba(244,114,182,0.24), rgba(244,114,182,0.08))',
                    border: '1px solid rgba(244,114,182,0.46)',
                    color: '#fff', fontSize: 12, fontFamily: FONT.mono, fontWeight: 600,
                    letterSpacing: '0.04em', cursor: 'pointer',
                    boxShadow: '0 0 22px rgba(244,114,182,0.18), inset 0 1px 0 rgba(255,255,255,0.14)' }}>
                  read essay
                  <span style={{ fontSize: 13, color: DARK.pink }}>→</span>
                </button>
              </div>
            </div>
          </HomeTile>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          §03 — ACTIVITY EVIDENCE
          Thread (full-width on top) · GitHub + Topics (side-by-side below)
          ════════════════════════════════════════════════════════ */}

      <section style={{ position: 'relative', padding: '24px ' + pad + 'px 56px' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 24 }}>
          <SectionLabel color={DARK.blue}>§ 03 · activity</SectionLabel>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400,
            color: '#fff', fontStyle: 'italic', letterSpacing: '-0.005em' }}>
            evidence the notebook is still alive.
          </span>
          <div style={{ flex: 1, height: 1,
            background: 'linear-gradient(90deg, rgba(56,189,248,0.2), transparent 75%)' }}></div>
          <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
            letterSpacing: '0.04em', opacity: 0.7 }}>
            {PUBLIC_THREAD.updated} · {PUBLIC_THREAD.source}
          </span>
        </div>

        {/* TOP — full-width thread card */}
        <div style={{ marginBottom: 16 }}>
          <CurrentThreadEditorial />
        </div>

        {/* BOTTOM — github + topics side-by-side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          alignItems: 'stretch' }}>
          <GitHubTile />
          <TopicsIndexTile />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          §04 — MARGINALIA  (full-width)
          ════════════════════════════════════════════════════════ */}

      <section style={{ position: 'relative', padding: '24px ' + pad + 'px 48px' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 24 }}>
          <SectionLabel color={DARK.pink}>§ 04 · marginalia</SectionLabel>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 400,
            color: '#fff', fontStyle: 'italic', letterSpacing: '-0.005em' }}>
            in the margins, after the writing.
          </span>
          <div style={{ flex: 1, height: 1,
            background: 'linear-gradient(90deg, rgba(244,114,182,0.2), transparent 75%)' }}></div>
          <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
            letterSpacing: '0.04em', opacity: 0.7 }}>
            quotes.yml · rotates per build
          </span>
        </div>

        <MarginaliaFull />
      </section>

      {/* ── footer — copyright + compact contact strip ─── */}
      <div style={{ position: 'relative', padding: '0 ' + pad + 'px 48px' }}>
        <div style={{ height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(244,114,182,0.18) 30%, rgba(56,189,248,0.18) 70%, transparent)',
          marginBottom: 22 }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: FONT.mono, fontSize: 12 }}>
          <span style={{ color: DARK.muted }}>
            © 2026 EnderJones · Built with care in Tokyo · Astro
          </span>
          <ContactIcons />
        </div>
      </div>

      {/* ── direction label ──────────────────────────────── */}
      <div style={{ position: 'absolute', top: 24, left: pad - 30, display: 'flex', gap: 8,
        alignItems: 'center', zIndex: 20 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: DARK.pink,
          boxShadow: '0 0 8px ' + DARK.pink }}></div>
        <span style={{ fontSize: 10, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Homepage · v5 · editorial notebook · r5
        </span>
      </div>
    </div>
  );
}

// ============================================
// §01 — Hero tile (left, big)
// ============================================
function HeroTile() {
  return (
    <HomeTile accent="rgba(244,114,182,0.22)" glow="rgba(244,114,182,0.06)"
      source="static" sourceLabel="static · data/site.yml"
      style={{ gridRow: 'span 2', minHeight: 528 }}>

      <div style={{ position: 'absolute', inset: 0,
        backgroundImage: 'url("ang.JPG")',
        backgroundSize: 'cover', backgroundPosition: 'center 35%',
        filter: 'brightness(0.76) saturate(0.92) contrast(1.02)' }}></div>
      <div style={{ position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(7,8,9,0.1) 0%, rgba(7,8,9,0.5) 45%, rgba(7,8,9,0.97) 92%),
          radial-gradient(700px 520px at 25% 100%, rgba(244,114,182,0.14), transparent 60%)` }}></div>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.45,
        backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px' }}></div>

      <div style={{ position: 'absolute', top: 22, left: 26, right: 26,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 4 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: DARK.pink,
            boxShadow: '0 0 10px ' + DARK.pink, animation: 'ej-pulse-soft 2.5s ease-in-out infinite' }}></div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: FONT.mono,
            letterSpacing: '0.14em', textTransform: 'uppercase' }}>The author</span>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center',
          fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: FONT.mono,
          letterSpacing: '0.06em', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          <span>35°41′N · 139°41′E</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>JST 23:47</span>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 32, left: 36, right: 36, zIndex: 4 }}>
        <h1 style={{ fontSize: 80, fontWeight: 800, margin: 0, lineHeight: 0.94,
          letterSpacing: '-0.028em', color: '#fff', textShadow: '0 2px 28px rgba(0,0,0,0.55)' }}>
          <span style={{
            background: 'linear-gradient(115deg, #ffffff 35%, ' + DARK.pink + ' 95%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 18px rgba(244,114,182,0.22))' }}>Ender</span>
          <span style={{ color: '#fff' }}>Jones</span>
          <BlinkCursor color={DARK.pink} />
        </h1>
        <p style={{ fontSize: 16, color: '#e8eaed', margin: '20px 0 0', lineHeight: 1.55,
          fontWeight: 300, maxWidth: 580, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
          PhD candidate in Tokyo, researching{' '}
          <span style={{ color: DARK.pink, fontWeight: 500 }}>affective computing</span>
          {' '}&{' '}
          <span style={{ color: DARK.blue, fontWeight: 500 }}>multi-modal physiological signals</span>.
        </p>
        <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 14,
          color: 'rgba(255,255,255,0.62)', margin: '8px 0 0', maxWidth: 520 }}>
          A research notebook, writing archive, and append-only worklog.
        </p>

        <div style={{ marginTop: 24, height: 1,
          background: 'linear-gradient(90deg, rgba(244,114,182,0.55), rgba(56,189,248,0.3) 40%, transparent 75%)' }}></div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            ['github',  '@enderjones', DARK.mutedLight],
            ['twitter', '@enderjones', DARK.mutedLight],
            ['email',   'hi@…',        DARK.blue],
          ].map(([k, v, c], i) => (
            <span key={i} style={{ display: 'inline-flex', gap: 6, alignItems: 'baseline',
              fontSize: 11, fontFamily: FONT.mono,
              padding: '4px 11px', borderRadius: 999,
              background: 'rgba(7,8,9,0.5)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.09)' }}>
              <span style={{ color: DARK.muted }}>{k}</span>
              <span style={{ color: c }}>{v}</span>
            </span>
          ))}
        </div>
      </div>
    </HomeTile>
  );
}

// ============================================
// §01 — The Thesis (top right) — frontispiece treatment
// ============================================
function ThesisTile() {
  return (
    <HomeTile accent="rgba(52,211,153,0.2)" glow="rgba(52,211,153,0.04)"
      source="data" sourceLabel="research.yml">

      {/* faint green wash */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(420px 220px at 100% 100%, rgba(52,211,153,0.08), transparent 60%),
          linear-gradient(180deg, rgba(255,255,255,0.005), transparent)` }}></div>

      {/* corner brackets — frontispiece feel */}
      <div style={{ position: 'absolute', top: 14, left: 14, width: 16, height: 16,
        borderTop: '1px solid rgba(52,211,153,0.45)',
        borderLeft: '1px solid rgba(52,211,153,0.45)' }}></div>
      <div style={{ position: 'absolute', bottom: 14, right: 14, width: 16, height: 16,
        borderBottom: '1px solid rgba(52,211,153,0.45)',
        borderRight: '1px solid rgba(52,211,153,0.45)' }}></div>

      <div style={{ position: 'relative', padding: '26px 30px', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {/* top — stamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '3px 10px', borderRadius: 3,
            border: '1px solid rgba(52,211,153,0.25)',
            background: 'rgba(52,211,153,0.04)' }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 9, color: DARK.green,
              letterSpacing: '0.16em' }}>※ THE THESIS</span>
          </div>
          <div style={{ flex: 1, height: 1,
            background: 'linear-gradient(90deg, rgba(52,211,153,0.2), transparent)' }}></div>
          <span style={{ fontSize: 9, color: DARK.muted, fontFamily: FONT.mono,
            letterSpacing: '0.1em' }}>№ 2026.05</span>
        </div>

        {/* big serif title — frontispiece */}
        <div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 26, lineHeight: 1.18,
            color: '#fff', fontWeight: 400, letterSpacing: '-0.005em',
            textWrap: 'pretty' }}>
            Stress detection from{' '}
            <span style={{ fontStyle: 'italic', color: DARK.green }}>multi-modal</span>{' '}
            physiological signals.
          </div>
          <div style={{ marginTop: 12,
            fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13,
            color: DARK.mutedLight, lineHeight: 1.55, maxWidth: 360 }}>
            What I'm building, on the bench and on paper.
          </div>
        </div>

        {/* classification line (dotted leader) */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 10, color: DARK.green, fontFamily: FONT.mono,
            letterSpacing: '0.14em', textTransform: 'uppercase', flexShrink: 0 }}>
            cl.
          </span>
          <span style={{ flex: 1,
            borderBottom: '1px dotted rgba(52,211,153,0.28)',
            transform: 'translateY(-3px)' }}></span>
          <span style={{ fontSize: 11, color: DARK.mutedLight, fontFamily: FONT.mono,
            letterSpacing: '0.04em', flexShrink: 0 }}>
            affective computing · multi-modal DL · VLM
          </span>
        </div>
      </div>
    </HomeTile>
  );
}

// ============================================
// §01 — In the Margins (bottom right) — marginal note
// ============================================
function MarginsTile() {
  return (
    <HomeTile accent="rgba(56,189,248,0.22)" glow="rgba(56,189,248,0.04)"
      source="auto" sourceLabel="worklog · public:thread">

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(420px 220px at 0% 0%, rgba(56,189,248,0.08), transparent 60%)' }}></div>

      <div style={{ position: 'relative', padding: '24px 30px', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: DARK.blue, fontFamily: FONT.mono, fontSize: 13,
            fontWeight: 700 }}>↳</span>
          <SectionLabel color={DARK.blue}>in the margins · this week</SectionLabel>
          <div style={{ flex: 1 }}></div>
          <span style={{ fontSize: 10, color: DARK.blue, fontFamily: FONT.mono,
            display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: DARK.blue,
              boxShadow: '0 0 6px ' + DARK.blue,
              animation: 'ej-pulse-soft 2.5s ease-in-out infinite' }}></span>
            {PUBLIC_THREAD.stats.lastTouched}
          </span>
        </div>

        {/* Italic Georgia, like a marginal annotation */}
        <div>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 19,
            lineHeight: 1.4, color: '#fff', fontWeight: 400, letterSpacing: '-0.003em',
            margin: 0, textWrap: 'pretty', maxWidth: 380 }}>
            EDA-augmented stress classification.
          </p>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 13,
            color: DARK.mutedLight, margin: '8px 0 0', lineHeight: 1.5 }}>
            — paper iteration, round 2.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 12, borderTop: '1px dashed rgba(255,255,255,0.07)',
          fontSize: 10.5, fontFamily: FONT.mono }}>
          <span style={{ color: DARK.muted }}>{PUBLIC_THREAD.source}</span>
          <span style={{ color: DARK.blue }}>open worklog →</span>
        </div>
      </div>
    </HomeTile>
  );
}

// ============================================
// §03 — Current Thread Editorial (full-width)
// All content is derived from PUBLIC_THREAD = parseWorklog().
// No artificial widgets. Beautiful editorial card.
// ============================================
function CurrentThreadEditorial() {
  return (
    <HomeTile accent="rgba(56,189,248,0.22)" glow="rgba(56,189,248,0.06)"
      source="auto" sourceLabel="auto · worklog · public:thread">

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(900px 480px at 0% 0%, rgba(56,189,248,0.06), transparent 60%),
          radial-gradient(700px 380px at 100% 100%, rgba(167,139,250,0.04), transparent 65%)` }}></div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, rgba(56,189,248,0.5) 0%, rgba(56,189,248,0.1) 30%, transparent 75%)' }}></div>

      <div style={{ position: 'relative', padding: '32px 40px',
        display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 56,
        alignItems: 'flex-start' }}>

        {/* ── LEFT side: title + summary ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 11px', borderRadius: 3,
              background: 'rgba(56,189,248,0.08)',
              border: '1px solid rgba(56,189,248,0.26)' }}>
              <span style={{ color: DARK.blue, fontFamily: FONT.mono, fontSize: 12,
                fontWeight: 700 }}>$</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 10, color: DARK.blue,
                letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                public:thread
              </span>
            </div>
            <span style={{ fontSize: 10.5, color: DARK.muted, fontFamily: FONT.mono,
              letterSpacing: '0.04em' }}>
              parsed from <em style={{ color: DARK.mutedLight }}>{PUBLIC_THREAD.source}</em>
            </span>
          </div>

          {/* serif headline w/ left rule (decorative, not a maintained widget) */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 1.5,
              background: 'linear-gradient(180deg, ' + DARK.blue + ', rgba(56,189,248,0.15))',
              boxShadow: '0 0 8px rgba(56,189,248,0.35)', marginTop: 6 }}></div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: 1.2,
                color: '#fff', fontWeight: 400, letterSpacing: '-0.005em',
                margin: 0, textWrap: 'pretty' }}>
                EDA-augmented stress classification
                <span style={{ color: DARK.mutedLight }}>, paper iteration r2.</span>
              </h3>

              {/* the summary, parsed straight from the markdown */}
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: DARK.mutedLight,
                margin: '18px 0 0', lineHeight: 1.65, fontWeight: 300, textWrap: 'pretty',
                maxWidth: 520 }}>
                {PUBLIC_THREAD.summary}
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT side: bullets + stats ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24,
          paddingLeft: 40, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>

          {/* bullets — parsed from markdown */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
                letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                lines from the markdown
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.05)' }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PUBLIC_THREAD.bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: DARK.blue, fontFamily: FONT.mono, fontSize: 13,
                    lineHeight: '22px', flexShrink: 0, opacity: 0.7 }}>›</span>
                  <span style={{ fontSize: 13.5, color: '#cfd5dd', lineHeight: 1.55,
                    textWrap: 'pretty' }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* stats — auto, no manual updates */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
            paddingTop: 18, borderTop: '1px dashed rgba(255,255,255,0.07)' }}>
            <Stat label="entries" value={PUBLIC_THREAD.stats.entries} valueColor={DARK.blue} />
            <Stat label="words"   value={PUBLIC_THREAD.stats.words.toLocaleString()} valueColor="#fff" />
            <Stat label="updated" value={PUBLIC_THREAD.updated} valueColor={DARK.mutedLight} />
          </div>

          <div style={{ paddingTop: 6 }}>
            <a style={{ display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 16px', borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(56,189,248,0.18), rgba(56,189,248,0.06))',
              border: '1px solid rgba(56,189,248,0.42)',
              color: '#fff', fontSize: 12, fontFamily: FONT.mono, fontWeight: 600,
              letterSpacing: '0.04em', cursor: 'pointer',
              boxShadow: '0 0 18px rgba(56,189,248,0.15), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
              open worklog
              <span style={{ fontSize: 13, color: DARK.blue }}>→</span>
            </a>
          </div>
        </div>
      </div>
    </HomeTile>
  );
}

// ============================================
// §03 — GitHub tile (compact)
// ============================================
function GitHubTile() {
  return (
    <HomeTile accent="rgba(56,189,248,0.14)"
      source="data" sourceLabel="public/github-contributions.json">
      <div style={{ padding: '22px 26px', height: '100%',
        display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <SectionLabel color={DARK.blue}>GitHub · 26 wk</SectionLabel>
          <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
            @enderjones
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
          <span style={{ fontSize: 36, fontFamily: FONT.mono, fontWeight: 300, color: '#fff',
            letterSpacing: '-0.02em', lineHeight: 1 }}>182</span>
          <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>
            commits
          </span>
          <div style={{ flex: 1 }}></div>
          <span style={{ fontSize: 10.5, color: DARK.blue, fontFamily: FONT.mono,
            padding: '2px 8px', borderRadius: 999,
            background: 'rgba(56,189,248,0.08)',
            border: '1px solid rgba(56,189,248,0.22)' }}>
            ▲ +12 this wk
          </span>
        </div>
        <div style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
          marginTop: 6, marginBottom: 18 }}>
          longest streak · 14d
        </div>

        <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
          {Array.from({ length: 26 }).map((_, w) => (
            <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {Array.from({ length: 7 }).map((_, d) => {
                const seed = (w * 7 + d * 13 + 5) % 9;
                const level = seed < 3 ? 0 : seed < 5 ? 1 : seed < 7 ? 2 : 3;
                const colors = ['rgba(255,255,255,0.04)',
                  'rgba(56,189,248,0.2)','rgba(56,189,248,0.46)','rgba(56,189,248,0.82)'];
                return <div key={d} style={{ width: 9, height: 9, borderRadius: 2,
                  background: colors[level] }}></div>;
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
          <span>less</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {[0,1,2,3].map(l => {
              const colors = ['rgba(255,255,255,0.04)',
                'rgba(56,189,248,0.2)','rgba(56,189,248,0.46)','rgba(56,189,248,0.82)'];
              return <div key={l} style={{ width: 9, height: 9, borderRadius: 2,
                background: colors[l] }}></div>;
            })}
          </div>
          <span>more</span>
        </div>
      </div>
    </HomeTile>
  );
}

// ============================================
// §03 — Topics Index (dot-leader tag list)
// All 9 tags, colored by category. Beautiful & functional.
// ============================================
function TopicsIndexTile() {
  return (
    <HomeTile accent="rgba(244,114,182,0.16)" source="auto" sourceLabel="auto · tags">
      <div style={{ padding: '22px 26px', height: '100%',
        display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 14 }}>
          <SectionLabel color={DARK.pink}>Tag index · {TOPICS.length}</SectionLabel>
          <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
            sorted by frequency
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
          {TOPICS.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 13,
                color: TAG_COLOR[t.color], flexShrink: 0 }}>
                #{t.tag}
              </span>
              <span style={{ flex: 1,
                borderBottom: '1px dotted ' + (t.color === 'muted'
                  ? 'rgba(255,255,255,0.08)'
                  : TAG_COLOR[t.color] + '44'),
                transform: 'translateY(-3px)',
                opacity: 0.7 }}></span>
              <span style={{ fontFamily: FONT.mono, fontSize: 11,
                color: t.color === 'muted' ? DARK.muted : DARK.mutedLight,
                width: 18, textAlign: 'right', flexShrink: 0 }}>
                {String(t.count).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, paddingTop: 10,
          borderTop: '1px dashed rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 11, fontFamily: FONT.mono }}>
          <span style={{ color: DARK.muted }}>
            ↳ blue · research · pink
          </span>
          <span style={{ color: DARK.pink }}>all tags →</span>
        </div>
      </div>
    </HomeTile>
  );
}

// ============================================
// §04 — Marginalia (full-width)
// ============================================
function MarginaliaFull() {
  return (
    <HomeTile accent="rgba(244,114,182,0.16)" glow="rgba(244,114,182,0.04)"
      source="data" sourceLabel="data/quotes.yml"
      style={{ minHeight: 240 }}>

      {/* faint photo bg, soft & atmospheric */}
      <div style={{ position: 'absolute', inset: 0,
        backgroundImage: `url(${POST_IMAGES.poem})`,
        backgroundSize: 'cover', backgroundPosition: 'center 55%',
        filter: 'brightness(0.32) saturate(0.65) blur(1px)', opacity: 0.55 }}></div>
      <div style={{ position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, rgba(7,8,9,0.6) 0%, rgba(7,8,9,0.88) 100%),
          radial-gradient(820px 360px at 75% 100%, rgba(244,114,182,0.12), transparent 60%),
          radial-gradient(620px 320px at 18% 0%, rgba(167,139,250,0.06), transparent 60%)` }}></div>

      <div style={{ position: 'relative', padding: '42px 64px',
        display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 64,
        alignItems: 'center', minHeight: 240 }}>

        {/* the quote */}
        <div>
          <SectionLabel color={DARK.pink} style={{ marginBottom: 18 }}>※ Marginalia</SectionLabel>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontStyle: 'italic',
            lineHeight: 1.32, color: '#f4f6fa', margin: 0, fontWeight: 300,
            textWrap: 'pretty', letterSpacing: '-0.005em',
            textShadow: '0 1px 16px rgba(0,0,0,0.55)' }}>
            « J'aime les nuages…{' '}
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>
              les nuages qui passent… là-bas… les merveilleux nuages ! »
            </span>
          </p>
          <div style={{ marginTop: 22, fontSize: 11.5, color: 'rgba(255,255,255,0.55)',
            fontFamily: FONT.mono, letterSpacing: '0.04em' }}>
            — Baudelaire, <em style={{ color: 'rgba(255,255,255,0.75)' }}>L'Étranger</em>, 1869
          </div>
        </div>

        {/* the "in the margin" annotation column */}
        <div style={{ paddingLeft: 36, borderLeft: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SectionLabel color={DARK.mutedLight}>↳ A note from the editor</SectionLabel>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, margin: 0, textWrap: 'pretty' }}>
            Quotes drift through the site like clouds — they rotate each build, pulled at
            random from <code style={{ fontFamily: FONT.mono, fontSize: 12, color: DARK.pink,
            background: 'rgba(244,114,182,0.06)', padding: '1px 6px', borderRadius: 3 }}>
              quotes.yml</code>. None of them are advice.
          </p>
          <div style={{ fontSize: 10.5, color: DARK.muted, fontFamily: FONT.mono,
            letterSpacing: '0.04em', opacity: 0.75 }}>
            32 quotes loaded · next on next build
          </div>
        </div>
      </div>
    </HomeTile>
  );
}

// ============================================
// Footer — compact contact icon row
// ============================================
function ContactIcons() {
  // simple SVG glyphs — single-stroke, monochrome, on hover slightly brighter.
  const icons = [
    { key: 'github',  color: DARK.mutedLight, svg: (
      <path d="M12 1C5.9 1 1 5.9 1 12c0 4.9 3.2 9 7.6 10.5.6.1.8-.2.8-.6v-2c-3.1.7-3.8-1.5-3.8-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5-1.2-5-5.6 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.1-3 0 0 .9-.3 3.1 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.2-1.5 3.1-1.2 3.1-1.2.6 1.5.2 2.7.1 3 .7.8 1.2 1.8 1.2 3 0 4.4-2.6 5.3-5 5.6.4.3.8.9.8 1.9v2.8c0 .3.2.7.8.6C19.8 21 23 16.9 23 12c0-6.1-4.9-11-11-11z" />
    )},
    { key: 'twitter', color: DARK.mutedLight, svg: (
      <path d="M22 5.8c-.7.3-1.5.5-2.4.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-.7-.8-1.8-1.3-3-1.3-2.3 0-4.1 1.8-4.1 4.1 0 .3 0 .6.1.9C8.3 8.6 5.1 6.9 3 4.4c-.4.6-.6 1.3-.6 2.1 0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4-.4.1-.7.1-1.1.1-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.9-1.4 1.1-3.2 1.8-5.1 1.8H1c1.9 1.2 4.1 1.9 6.4 1.9 7.7 0 11.9-6.4 11.9-11.9v-.5c.8-.6 1.5-1.3 2.1-2.1z" />
    )},
    { key: 'email',   color: DARK.blue, svg: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="none" strokeWidth="1.6" />
        <path d="M3 6.5l9 6.5 9-6.5" fill="none" strokeWidth="1.6" />
      </>
    )},
    { key: 'rss',     color: DARK.muted, svg: (
      <>
        <path d="M4 4c8.8 0 16 7.2 16 16" fill="none" strokeWidth="2" />
        <path d="M4 11c5 0 9 4 9 9" fill="none" strokeWidth="2" />
        <circle cx="5.5" cy="18.5" r="1.8" />
      </>
    )},
  ];

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {icons.map((ic, i) => (
        <a key={i} title={ic.key}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(15,18,22,0.55)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: ic.color, cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s, background 0.2s' }}>
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill={ic.key === 'rss' ? 'currentColor' : ic.key === 'github' || ic.key === 'twitter' ? 'currentColor' : 'none'}
            stroke="currentColor">
            {ic.svg}
          </svg>
        </a>
      ))}
      <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', margin: '0 6px' }}></div>
      <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono, letterSpacing: '0.04em' }}>
        hi@…
      </span>
      <span style={{ fontSize: 10, color: DARK.green, fontFamily: FONT.mono,
        display: 'inline-flex', alignItems: 'center', gap: 5, marginLeft: 8 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: DARK.green,
          boxShadow: '0 0 6px ' + DARK.green }}></span>
        available
      </span>
    </div>
  );
}

// ────────────────────────────────────────────────
function Stat({ label, value, valueColor = '#fff' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 9.5, color: DARK.muted, fontFamily: FONT.mono,
        letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: 16, color: valueColor, fontFamily: FONT.mono,
        fontWeight: 500, letterSpacing: '-0.005em' }}>{value}</span>
    </div>
  );
}

Object.assign(window, { EditorialHome });
