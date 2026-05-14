// ============================================
// E v4: BENTO HOMEPAGE — Visitor-first
//
// Hierarchy (top → bottom):
//   1. Identity  +  Research Now             ← who & what they do
//   2. Recent Writing  +  Current Thread     ← writing + research activity signal
//   3. Selected Entry  +  Topics  +  About   ← optional entry points
//   4. Marginalia  +  GitHub                 ← atmosphere & quiet evidence
//
// Source contract for every tile:
//   • static     — written into layout / data/site.yml
//   • auto       — derived from posts or worklogs collections
//   • data       — derived from data/*.yml
//   • collapsed  — fallback state when data is missing or stale
// ============================================

// ---------- Shared atoms ----------
const Source = ({ kind, label }) => {
  const colors = {
    static:   { bg: 'rgba(148,163,184,0.07)', fg: 'rgba(166,173,182,0.85)', dot: DARK.muted },
    auto:     { bg: 'rgba(56,189,248,0.07)',  fg: 'rgba(125,211,252,0.95)', dot: DARK.blue },
    data:     { bg: 'rgba(167,139,250,0.07)', fg: 'rgba(196,181,253,0.95)', dot: DARK.purple },
    collapsed:{ bg: 'rgba(148,163,184,0.05)', fg: 'rgba(120,130,140,0.85)', dot: DARK.muted },
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

const Tile = ({ children, accent = DARK.border, glow, style = {}, source, sourceLabel }) => (
  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden',
    border: '1px solid ' + accent, background: DARK.surface,
    boxShadow: glow ? `0 0 28px ${glow}, inset 0 1px 0 rgba(255,255,255,0.03)`
      : 'inset 0 1px 0 rgba(255,255,255,0.03)', ...style }}>
    {source && (
      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 5,
        opacity: 0.55, transition: 'opacity 0.2s' }}>
        <Source kind={source} label={sourceLabel} />
      </div>
    )}
    {children}
  </div>
);

// ============================================
// Individual tile bodies — also reused on alternate-state artboards
// ============================================

function IdentityTileBody() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0,
        backgroundImage: `url("ang.JPG")`, backgroundSize: 'cover',
        backgroundPosition: 'center', filter: 'brightness(0.88)' }}></div>
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, transparent 30%, rgba(7,8,9,0.95) 88%)' }}></div>
      <div style={{ position: 'absolute', bottom: 22, left: 24, right: 24, zIndex: 2 }}>
        <SectionLabel color={DARK.pink} style={{ marginBottom: 10 }}>The author</SectionLabel>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, color: '#fff' }}>EnderJones</div>
        <div style={{ fontSize: 12, color: DARK.mutedLight, fontFamily: FONT.mono, marginBottom: 14 }}>
          PhD candidate · Tokyo, Japan
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['github','twitter','email'].map((s, i) => (
            <span key={i} style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
              padding: '3px 10px', borderRadius: 999,
              background: 'rgba(7,8,9,0.5)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)' }}>{s}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function ResearchNowTileBody() {
  return (
    <div style={{ padding: '28px 32px', height: '100%', display: 'flex',
      flexDirection: 'column', justifyContent: 'space-between',
      background: 'radial-gradient(600px 260px at 100% 100%, rgba(52,211,153,0.05), transparent 60%)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <SectionLabel color={DARK.green}>※ Research · Now</SectionLabel>
          <div style={{ flex: 1, height: 1,
            background: 'linear-gradient(90deg, rgba(52,211,153,0.2), transparent 70%)' }}></div>
          <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
            data/research.yml · updated 2026.05
          </span>
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: 1.25,
          color: '#fff', fontWeight: 400, letterSpacing: '-0.005em', marginBottom: 14,
          textWrap: 'pretty', maxWidth: 720 }}>
          Stress detection from multi-modal physiological signals.
        </div>
        <div style={{ fontSize: 14, color: DARK.mutedLight, lineHeight: 1.7,
          maxWidth: 660, textWrap: 'pretty' }}>
          Reproducing CCT-LSTM on BP4D++ with EDA augmentation; exploring 3-class severity
          classification and visual–physiological fusion. Considering VLM/LLM directions for
          emotion recognition next.
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {['affective computing','multi-modal DL','vision transformers','stress detection','VLM/LLM'].map((t, i) => (
          <span key={i} style={{ fontSize: 11, color: '#cfd5dd', fontFamily: FONT.mono,
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(52,211,153,0.05)',
            border: '1px solid rgba(52,211,153,0.18)' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function RecentWritingTileBody({ posts }) {
  return (
    <div style={{ padding: '24px 26px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#fff' }}>Recent Writing</h3>
        <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>all posts →</span>
      </div>
      <div style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono, marginBottom: 18 }}>
        {posts.length} posts · sorted by date
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {posts.map((post, i) => (
          <div key={i} style={{ display: 'flex', gap: 18, padding: '14px 0',
            borderBottom: i < posts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.06)' }}>
              <img src={post.img} style={{ width: '100%', height: '100%', objectFit: 'cover',
                filter: 'brightness(0.85) saturate(0.9)' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: '#fff',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {post.title}
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>{post.date}</span>
                {post.tags.slice(0, 2).map((t, j) => (
                  <span key={j} style={{ fontSize: 10, color: DARK.mutedLight, fontFamily: FONT.mono,
                    padding: '1px 7px', borderRadius: 3, background: 'rgba(255,255,255,0.04)' }}>#{t}</span>
                ))}
              </div>
            </div>
            <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono, flexShrink: 0 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Current Thread — 3 states ----------

function CurrentThreadBody({ variant = 'normal' }) {
  const stale = variant === 'stale';
  const collapsed = variant === 'collapsed';

  // Collapsed state: tile compresses to a single line nudge
  if (collapsed) {
    return (
      <div style={{ padding: '28px 28px', height: '100%', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
        <SectionLabel color={DARK.muted}>↳ Current Thread</SectionLabel>
        <div style={{ fontSize: 16, color: DARK.mutedLight, lineHeight: 1.6, fontWeight: 300,
          fontFamily: 'Georgia, serif', fontStyle: 'italic', textWrap: 'pretty' }}>
          Last worklog: 2026-03. No public thread set —{' '}
          <span style={{ color: DARK.blue, fontStyle: 'normal', fontFamily: FONT.mono, fontSize: 13 }}>
            append a new entry
          </span>{' '}
          to refresh.
        </div>
        <div style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
          paddingTop: 10, borderTop: '1px dashed rgba(255,255,255,0.05)' }}>
          source: <em>worklogs/2026-03.md</em> · no public:thread block
        </div>
      </div>
    );
  }

  const headline = 'EDA-augmented stress classification, paper iteration.';
  const bullets = [
    'CCT-LSTM evaluation, round 2',
    'Survey: VLM/LLM for emotion recognition',
    'Closed-loop RAG workflow prototype',
  ];
  const updatedLabel = stale ? 'updated 27d ago' : 'updated 4d ago';
  const updatedColor = stale ? DARK.muted : DARK.blue;

  return (
    <div style={{ padding: '24px 26px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff',
          display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: DARK.blue, fontFamily: FONT.mono, fontSize: 14 }}>$</span>
          Current Thread
        </h3>
        <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>open worklog →</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 22 }}>
        <span style={{ fontSize: 11, color: updatedColor, fontFamily: FONT.mono }}>● {updatedLabel}</span>
        <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>· 2026-05 worklog</span>
      </div>

      {/* Public-safe headline */}
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 19, lineHeight: 1.4, color: '#fff',
        fontWeight: 400, marginBottom: 18, textWrap: 'pretty', letterSpacing: '-0.005em' }}>
        {headline}
      </div>

      {/* Bullets — visible activity signal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ color: DARK.blue, fontFamily: FONT.mono, fontSize: 12,
              lineHeight: '22px', flexShrink: 0, opacity: 0.7 }}>›</span>
            <span style={{ fontSize: 13, color: '#cfd5dd', lineHeight: 1.65, textWrap: 'pretty' }}>
              {b}
            </span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}></div>

      {stale && (
        <div style={{ fontSize: 11, color: DARK.amber, fontFamily: FONT.mono,
          padding: '8px 12px', borderRadius: 6, marginBottom: 10,
          background: 'rgba(245,158,11,0.05)',
          border: '1px solid rgba(245,158,11,0.15)' }}>
          thread is getting old — add an entry
        </div>
      )}

      <div style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
        paddingTop: 12, borderTop: '1px dashed rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'space-between' }}>
        <span>source: <em>worklogs/2026-05.md</em> · public:thread block</span>
        <span>research-continuity signal · not a todo</span>
      </div>
    </div>
  );
}

// ---------- Selected Entry — 4 fallback variants ----------

function SelectedEntryBody({ variant = 'selected' }) {
  if (variant === 'selected' || variant === 'pinned') {
    const label = variant === 'selected' ? 'Selected Writing' : 'Selected Essay';
    return (
      <div style={{ padding: '22px 24px', height: '100%', display: 'flex', flexDirection: 'column',
        gap: 14, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SectionLabel color={DARK.pink}>★ {label}</SectionLabel>
          <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>2025.04</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 88, height: 88, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.08)' }}>
            <img src={POST_IMAGES.whoami} style={{ width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.85) saturate(0.9)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.3,
              marginBottom: 8 }}>
              Who Am I?
            </div>
            <div style={{ fontSize: 12, color: DARK.mutedLight, lineHeight: 1.6,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              A kid wanted to be a scientist, but lost precious things on the road.
            </div>
          </div>
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: DARK.mutedLight, fontFamily: FONT.mono,
            padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)' }}>#blogging</span>
          <span style={{ fontSize: 10, color: DARK.blue, fontFamily: FONT.mono }}>中文 available</span>
          <div style={{ flex: 1 }}></div>
          <span style={{ fontSize: 11, color: DARK.pink, fontFamily: FONT.mono }}>read →</span>
        </div>
      </div>
    );
  }

  if (variant === 'startHere') {
    return (
      <div style={{ padding: '22px 24px', height: '100%', display: 'flex', flexDirection: 'column',
        gap: 14 }}>
        <SectionLabel color={DARK.pink}>↳ Start Here</SectionLabel>
        <div style={{ fontSize: 19, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
          Who Am I?
        </div>
        <div style={{ fontSize: 13, color: DARK.mutedLight, lineHeight: 1.7 }}>
          A short essay on how I arrived at affective computing, written when I started
          this site. The closest thing to a personal introduction.
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
            2025.04 · 8 min · fallback: no selected/pinned post
          </span>
          <span style={{ fontSize: 11, color: DARK.pink, fontFamily: FONT.mono }}>read →</span>
        </div>
      </div>
    );
  }

  if (variant === 'latest') {
    return (
      <div style={{ padding: '22px 24px', height: '100%', display: 'flex', flexDirection: 'column',
        gap: 14 }}>
        <SectionLabel color={DARK.muted}>↳ Latest Writing</SectionLabel>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
          What Distance Taught Us
        </div>
        <div style={{ fontSize: 13, color: DARK.mutedLight, lineHeight: 1.7 }}>
          A short poem on seasons, distance, and memory.
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
            2026.05 · fallback: no selected, no pinned, no who-am-i
          </span>
          <span style={{ fontSize: 11, color: DARK.mutedLight, fontFamily: FONT.mono }}>read →</span>
        </div>
      </div>
    );
  }

  // variant === 'research' — final fallback, text-only
  return (
    <div style={{ padding: '22px 24px', height: '100%', display: 'flex', flexDirection: 'column',
      gap: 12 }}>
      <SectionLabel color={DARK.green}>↳ Currently Researching</SectionLabel>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#fff', lineHeight: 1.35,
        fontWeight: 400, textWrap: 'pretty' }}>
        Stress detection from multi-modal physiological signals.
      </div>
      <div style={{ fontSize: 12, color: DARK.mutedLight, lineHeight: 1.7 }}>
        I haven't selected a Writing entry yet. The research focus is shown here instead —
        see /research for the full thread.
      </div>
      <div style={{ flex: 1 }}></div>
      <div style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
        final fallback · no posts available to feature
      </div>
    </div>
  );
}

// ============================================
// MAIN HOMEPAGE
// ============================================

function BentoArchive() {
  const pad = 64;

  return (
    <div style={{ width: 1440, minHeight: 2080, background: '#070809', fontFamily: FONT.sans,
      color: DARK.text, position: 'relative', overflow: 'hidden' }}>

      {/* Atmospheric background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(to right, rgba(148,163,184,0.018) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.018) 1px, transparent 1px),
          radial-gradient(700px 500px at 18% 12%, rgba(244,114,182,0.04), transparent 55%),
          radial-gradient(700px 500px at 85% 60%, rgba(56,189,248,0.035), transparent 55%)`,
        backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%' }} />

      {/* ============ NAV ============ */}
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

      {/* ============ INTRO STRIP ============ */}
      <div style={{ position: 'relative', padding: '44px ' + pad + 'px 20px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 24, height: 1, background: DARK.pink }}></div>
          <SectionLabel color={DARK.pink}>Personal Archive · № 01 · Est. 2025</SectionLabel>
          <div style={{ flex: 1, height: 1,
            background: 'linear-gradient(90deg, rgba(244,114,182,0.22), transparent)' }}></div>
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 800, margin: 0, lineHeight: 1,
          letterSpacing: '-0.025em', color: '#fff' }}>
          Hi, I'm <span style={{
            background: 'linear-gradient(135deg, ' + DARK.pink + ' 0%, ' + DARK.blue + ' 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 22px rgba(244,114,182,0.2))' }}>Ender</span><BlinkCursor color={DARK.pink} />
        </h1>
        <p style={{ fontSize: 16, color: '#cfd5dd', margin: '18px 0 0', lineHeight: 1.6,
          maxWidth: 640, fontWeight: 300 }}>
          PhD candidate in Tokyo, researching{' '}
          <span style={{ color: DARK.pink, fontWeight: 500 }}>affective computing</span>
          {' '}&{' '}
          <span style={{ color: DARK.blue, fontWeight: 500 }}>multi-modal deep learning</span>.
          This is my notebook: essays, research notes, and an append-only worklog.
        </p>
      </div>

      {/* ============ BENTO GRID ============ */}
      <div style={{ position: 'relative', padding: '32px ' + pad + 'px 48px',
        display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
        gridAutoRows: '120px', gap: 14 }}>

        {/* ─────── BAND 1 — Identity + Research Now ─────── */}

        <Tile accent="rgba(244,114,182,0.15)" glow="rgba(244,114,182,0.04)"
          source="static" sourceLabel="static"
          style={{ gridColumn: 'span 4', gridRow: 'span 2' }}>
          <IdentityTileBody />
        </Tile>

        <Tile accent="rgba(52,211,153,0.15)"
          source="data" sourceLabel="data/research.yml"
          style={{ gridColumn: 'span 8', gridRow: 'span 2' }}>
          <ResearchNowTileBody />
        </Tile>

        {/* ─────── BAND 2 — Recent Writing + Current Thread ─────── */}

        <Tile source="auto" sourceLabel="auto · posts"
          style={{ gridColumn: 'span 7', gridRow: 'span 3' }}>
          <RecentWritingTileBody posts={POSTS} />
        </Tile>

        <Tile accent="rgba(56,189,248,0.18)" glow="rgba(56,189,248,0.04)"
          source="auto" sourceLabel="auto · worklog"
          style={{ gridColumn: 'span 5', gridRow: 'span 3' }}>
          <CurrentThreadBody variant="normal" />
        </Tile>

        {/* ─────── BAND 3 — Selected Entry + Topics + About ─────── */}

        <Tile accent="rgba(244,114,182,0.12)"
          source="auto" sourceLabel="auto · rotates weekly · build-time"
          style={{ gridColumn: 'span 5', gridRow: 'span 2' }}>
          <SelectedEntryBody variant="selected" />
        </Tile>

        <Tile source="auto" sourceLabel="auto · tags"
          style={{ gridColumn: 'span 4', gridRow: 'span 2' }}>
          <div style={{ padding: '22px 24px', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 16 }}>
              <SectionLabel>Browse by topic</SectionLabel>
              <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>all tags →</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {[
                ['AI', 12, DARK.blue],['machine-learning', 8, DARK.blue],
                ['research', 6, DARK.green],['paper-notes', 4, DARK.blue],
                ['blogging', 4, DARK.pink],['evaluation', 3, DARK.blue],
                ['poem', 2, DARK.pink],['memory', 2, DARK.pink],
                ['others', 5, DARK.muted],
              ].map(([tag, count, color], i) => (
                <span key={i} style={{ fontSize: 12, color: color, fontFamily: FONT.mono,
                  padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.05)' }}>
                  #{tag} <span style={{ color: DARK.muted, fontSize: 10 }}>{count}</span>
                </span>
              ))}
            </div>
          </div>
        </Tile>

        <Tile source="static" sourceLabel="static"
          style={{ gridColumn: 'span 3', gridRow: 'span 2' }}>
          <div style={{ padding: '22px 22px', height: '100%', display: 'flex',
            flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <SectionLabel style={{ marginBottom: 12 }}>↳ About</SectionLabel>
              <div style={{ fontSize: 13, color: DARK.mutedLight, lineHeight: 1.55 }}>
                Read more about who I am, what I work on, and how to reach me.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>
                github · twitter · email
              </span>
              <span style={{ fontSize: 13, color: DARK.pink, fontFamily: FONT.mono,
                display: 'flex', alignItems: 'center', gap: 8 }}>
                open<span>→</span>
              </span>
            </div>
          </div>
        </Tile>

        {/* ─────── BAND 4 — Marginalia + GitHub ─────── */}

        <Tile accent="rgba(244,114,182,0.1)"
          source="data" sourceLabel="data/quotes.yml"
          style={{ gridColumn: 'span 7', gridRow: 'span 2' }}>
          <div style={{ padding: '24px 30px', height: '100%', display: 'flex',
            flexDirection: 'column', justifyContent: 'center' }}>
            <SectionLabel color={DARK.pink} style={{ marginBottom: 14 }}>※ Marginalia</SectionLabel>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontStyle: 'italic',
              lineHeight: 1.7, color: '#e8eaed', margin: 0, fontWeight: 300, textWrap: 'pretty' }}>
              « J'aime les nuages… <span style={{ color: DARK.mutedLight }}>
              les nuages qui passent… là-bas… les merveilleux nuages ! »</span>
            </p>
            <div style={{ marginTop: 12, fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
              letterSpacing: '0.04em' }}>
              — Baudelaire, <em style={{ color: DARK.mutedLight }}>L'Étranger</em>, 1869 ·
              rotates per build
            </div>
          </div>
        </Tile>

        <Tile source="data" sourceLabel="public/github-contributions.json"
          style={{ gridColumn: 'span 5', gridRow: 'span 2' }}>
          <div style={{ padding: '22px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 6 }}>
              <SectionLabel>GitHub · last 26 weeks</SectionLabel>
              <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>snapshot 2026-05-13</span>
            </div>
            <div style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono, marginBottom: 16 }}>
              182 commits · @enderjones
            </div>
            {/* heatmap */}
            <div style={{ display: 'flex', gap: 3, flex: 1, alignItems: 'center' }}>
              {Array.from({ length: 26 }).map((_, w) => (
                <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {Array.from({ length: 7 }).map((_, d) => {
                    const seed = (w * 7 + d * 13 + 5) % 9;
                    const level = seed < 3 ? 0 : seed < 5 ? 1 : seed < 7 ? 2 : 3;
                    const colors = ['rgba(255,255,255,0.04)',
                      'rgba(56,189,248,0.18)','rgba(56,189,248,0.42)','rgba(56,189,248,0.78)'];
                    return <div key={d} style={{ width: 9, height: 9, borderRadius: 2,
                      background: colors[level] }}></div>;
                  })}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 12, fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
              <span>less</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0,1,2,3].map(l => {
                  const colors = ['rgba(255,255,255,0.04)',
                    'rgba(56,189,248,0.18)','rgba(56,189,248,0.42)','rgba(56,189,248,0.78)'];
                  return <div key={l} style={{ width: 9, height: 9, borderRadius: 2,
                    background: colors[l] }}></div>;
                })}
              </div>
              <span>more</span>
            </div>
          </div>
        </Tile>

      </div>

      {/* ============ FOOTER ============ */}
      <div style={{ position: 'relative', padding: '0 ' + pad + 'px 48px' }}>
        <div style={{ height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(244,114,182,0.15) 30%, rgba(56,189,248,0.15) 70%, transparent)',
          marginBottom: 28 }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: FONT.mono, fontSize: 12 }}>
          <span style={{ color: DARK.muted }}>© 2026 EnderJones · Built with care in Tokyo · Astro</span>
          <div style={{ display: 'flex', gap: 18 }}>
            {['github','twitter','email','rss'].map((s, i) => (
              <span key={i} style={{ color: DARK.mutedLight }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Direction label */}
      <div style={{ position: 'absolute', top: 24, left: pad - 30, display: 'flex', gap: 8,
        alignItems: 'center', zIndex: 20 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: DARK.blue,
          boxShadow: '0 0 8px ' + DARK.blue }}></div>
        <span style={{ fontSize: 10, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Homepage · v4 · visitor-first
        </span>
      </div>
    </div>
  );
}

// ============================================
// SMALL ARTBOARDS — alternate state previews
// ============================================

// Wrapper that mimics the tile chrome of a single bento cell.
function TileSandbox({ title, accent, width = 600, height = 360, source, sourceLabel, children }) {
  return (
    <div style={{ width, padding: 20, background: '#070809', fontFamily: FONT.sans,
      color: DARK.text }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
        <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>{sourceLabel}</span>
      </div>
      <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden',
        border: '1px solid ' + (accent || DARK.border), background: DARK.surface,
        height, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)' }}>
        {source && (
          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 5, opacity: 0.55 }}>
            <Source kind={source} label={sourceLabel} />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function CurrentThreadStates() {
  return (
    <div style={{ width: 1440, padding: '32px 40px', background: '#070809',
      fontFamily: FONT.sans, color: DARK.text }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: DARK.blue,
          boxShadow: '0 0 8px ' + DARK.blue }}></div>
        <span style={{ fontSize: 11, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Current Thread · staleness states
        </span>
      </div>
      <p style={{ fontSize: 13, color: DARK.mutedLight, maxWidth: 720, marginBottom: 24,
        lineHeight: 1.7 }}>
        The tile reads the worklog's <code style={{ fontFamily: FONT.mono, fontSize: 12,
          color: DARK.blue }}>&lt;!-- public:thread --&gt;</code> block or{' '}
        <code style={{ fontFamily: FONT.mono, fontSize: 12, color: DARK.blue }}>public_thread</code>{' '}
        frontmatter. Raw working notes elsewhere in the worklog are not surfaced here.
        Three states based on the worklog's <em>last updated</em> stamp:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <TileSandbox title="① normal · ≤ 14d" accent="rgba(56,189,248,0.18)"
          source="auto" sourceLabel="updated 4d ago" width={440} height={420}>
          <CurrentThreadBody variant="normal" />
        </TileSandbox>
        <TileSandbox title="② stale · 14–45d" accent="rgba(245,158,11,0.18)"
          source="auto" sourceLabel="updated 27d ago" width={440} height={420}>
          <CurrentThreadBody variant="stale" />
        </TileSandbox>
        <TileSandbox title="③ collapsed · &gt; 45d" accent="rgba(148,163,184,0.12)"
          source="collapsed" sourceLabel="no public:thread" width={440} height={420}>
          <CurrentThreadBody variant="collapsed" />
        </TileSandbox>
      </div>
    </div>
  );
}

function SelectedEntryStates() {
  return (
    <div style={{ width: 1440, padding: '32px 40px', background: '#070809',
      fontFamily: FONT.sans, color: DARK.text }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: DARK.pink,
          boxShadow: '0 0 8px ' + DARK.pink }}></div>
        <span style={{ fontSize: 11, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Selected Entry · fallback + rotation
        </span>
      </div>
      <p style={{ fontSize: 13, color: DARK.mutedLight, maxWidth: 820, marginBottom: 14,
        lineHeight: 1.7 }}>
        Resolution chain on every build:&nbsp;
        <code style={{ fontFamily: FONT.mono, fontSize: 12, color: DARK.pink }}>
          selected: true → pinned: true → who-am-i → latest post → research thesis
        </code>
        .&nbsp;Every state is real content.
      </p>
      <p style={{ fontSize: 13, color: DARK.mutedLight, maxWidth: 820, marginBottom: 24,
        lineHeight: 1.7 }}>
        <strong style={{ color: '#fff' }}>Rotation:</strong> when 2+ posts qualify (e.g. several
        <code style={{ fontFamily: FONT.mono, fontSize: 12, color: DARK.pink }}> selected: true</code>),
        the tile picks one per ISO-week using
        <code style={{ fontFamily: FONT.mono, fontSize: 12, color: DARK.pink }}> entries[weekOfYear % entries.length]</code>.
        Build-time deterministic, no JS, no surprises. First impression always stable.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        <TileSandbox title="① selected: true" accent="rgba(244,114,182,0.18)"
          source="auto" sourceLabel="selected: true" width={660} height={280}>
          <SelectedEntryBody variant="selected" />
        </TileSandbox>
        <TileSandbox title="② pinned: true (no selected)" accent="rgba(244,114,182,0.14)"
          source="auto" sourceLabel="pinned: true" width={660} height={280}>
          <SelectedEntryBody variant="pinned" />
        </TileSandbox>
        <TileSandbox title="③ who-am-i fallback" accent="rgba(244,114,182,0.1)"
          source="auto" sourceLabel="slug: who-am-i" width={660} height={280}>
          <SelectedEntryBody variant="startHere" />
        </TileSandbox>
        <TileSandbox title="④ latest post fallback" accent="rgba(148,163,184,0.12)"
          source="auto" sourceLabel="latest post" width={660} height={280}>
          <SelectedEntryBody variant="latest" />
        </TileSandbox>
        <TileSandbox title="⑤ research thesis · final fallback" accent="rgba(52,211,153,0.14)"
          source="data" sourceLabel="data/research.yml" width={660} height={240}>
          <SelectedEntryBody variant="research" />
        </TileSandbox>
      </div>
    </div>
  );
}

Object.assign(window, { BentoArchive, CurrentThreadStates, SelectedEntryStates });
