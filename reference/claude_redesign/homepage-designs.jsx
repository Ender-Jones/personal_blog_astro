// ============================================
// SHARED DATA & UTILITIES
// ============================================

const POST_IMAGES = {
  whoami: 'assets/img/whoami/DSCF1111.jpg',
  poem: 'assets/img/poems/cherry-blossom-wide.jpg',
  regression: 'assets/img/regression/title.png',
  ai: 'assets/img/AiTake/chatgpt-plus.jpg',
  yokosuka: 'assets/img/whoami/yokosuka.png',
};

const POSTS = [
  { title: 'Who Am I?', date: '2025.04.29', tags: ['blogging'], pinned: true,
    desc: 'A kid wanted to be a scientist, but lost precious things on the road.',
    img: POST_IMAGES.whoami },
  { title: 'What Distance Taught Us', date: '2026.05.07', tags: ['poem','memory'],
    desc: 'A short poem on seasons, distance, and memory.',
    img: POST_IMAGES.poem },
  { title: 'Regression Model Evaluation Metrics', date: '2025.05.08', tags: ['AI','ML'],
    desc: 'MAE, MSE, RMSE, and R² explained — a comprehensive guide.',
    img: POST_IMAGES.regression },
  { title: 'Prompt Engineering & Major Model Takes', date: '2025.09.01', tags: ['AI'],
    desc: 'Practical prompt engineering patterns and model comparison notes.',
    img: POST_IMAGES.ai },
];

const DARK = {
  bg: '#070809', surface: '#0e1014', surfaceHover: '#141820',
  pink: '#f472b6', blue: '#38bdf8', purple: '#a78bfa', green: '#34d399', amber: '#f59e0b',
  text: '#f1f3f5', muted: '#6b7785', mutedLight: '#8b95a1',
  border: 'rgba(255,255,255,0.06)', borderHover: 'rgba(255,255,255,0.12)',
};

const FONT = { sans: "'Noto Sans', system-ui, sans-serif", mono: "'Fira Code', monospace" };

function NavDot({ color, size = 8 }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 }}></span>;
}

function SectionLabel({ children, color = DARK.muted, style = {} }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
      color, fontFamily: FONT.mono, ...style }}>
      {children}
    </div>
  );
}

function LightPalette({ colors, labels }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '32px 0 0' }}>
      <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono, letterSpacing: '0.08em',
        textTransform: 'uppercase', marginRight: 8 }}>Light mode →</span>
      {colors.map((c, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: c,
            border: '1px solid rgba(0,0,0,0.08)' }}></div>
          {labels && labels[i] && (
            <span style={{ fontSize: 9, color: DARK.muted, fontFamily: FONT.mono }}>{labels[i]}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function BlinkCursor({ color = DARK.pink }) {
  return <span style={{ color, animation: 'blink 1s step-end infinite', fontWeight: 400 }}>_</span>;
}


// ============================================
// VARIATION A: QUIET GRID (Refined v2)
// Your DNA evolved — real images, blinking
// cursor, richer post cards with photos.
// ============================================

function QuietGrid() {
  const pad = 80;

  return (
    <div style={{ width: 1440, minHeight: 2600, background: DARK.bg, fontFamily: FONT.sans,
      color: DARK.text, position: 'relative', overflow: 'hidden' }}>

      {/* Grid + atmospheric blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(to right, rgba(148,163,184,0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.02) 1px, transparent 1px),
          radial-gradient(700px 500px at 20% 15%, rgba(244,114,182,0.07), transparent 55%),
          radial-gradient(600px 500px at 80% 50%, rgba(56,189,248,0.05), transparent 55%)`,
        backgroundSize: '40px 40px, 40px 40px, 100% 100%, 100% 100%' }} />

      {/* Nav */}
      <nav style={{ position: 'relative', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '0 ' + pad + 'px', height: 64,
        borderBottom: '1px solid ' + DARK.border }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 15, fontWeight: 700, color: DARK.text,
          letterSpacing: '0.02em' }}>
          EnderJones<BlinkCursor color={DARK.pink} />
        </span>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Home','Posts','Tags','Archives','Work Log'].map((item, i) => (
            <span key={i} style={{ fontSize: 13, color: i === 0 ? DARK.pink : DARK.muted,
              fontFamily: FONT.mono, cursor: 'pointer', letterSpacing: '0.02em',
              borderBottom: i === 0 ? '1px solid ' + DARK.pink : 'none', paddingBottom: 2 }}>
              {item}
            </span>
          ))}
          <div style={{ width: 1, height: 16, background: DARK.border }}></div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: DARK.blue, fontFamily: FONT.mono, fontWeight: 600 }}>EN</span>
            <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>中文</span>
          </div>
        </div>
      </nav>

      {/* Hero — cinematic full-bleed with photo */}
      <div style={{ position: 'relative', height: 820, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 28, overflow: 'hidden' }}>

        {/* Cinematic background photo */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.22,
          backgroundImage: `url(${POST_IMAGES.yokosuka})`,
          backgroundSize: 'cover', backgroundPosition: 'center 60%',
          filter: 'blur(1px) saturate(0.5) brightness(0.7)' }} />
        {/* Dark overlay with grid */}
        <div style={{ position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, rgba(7,8,9,0.55) 0%, rgba(7,8,9,0.75) 50%, rgba(7,8,9,0.95) 100%),
            linear-gradient(to right, rgba(148,163,184,0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.025) 1px, transparent 1px)`,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px' }} />
        {/* Color washes */}
        <div style={{ position: 'absolute', inset: 0,
          background: `radial-gradient(600px 400px at 25% 30%, rgba(244,114,182,0.12), transparent 60%),
            radial-gradient(600px 400px at 75% 70%, rgba(56,189,248,0.1), transparent 60%)` }} />

        {/* Avatar */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ width: 156, height: 156, borderRadius: 12, overflow: 'hidden',
            border: '1px solid rgba(244,114,182,0.4)',
            boxShadow: '0 0 80px rgba(244,114,182,0.12), 0 24px 70px rgba(0,0,0,0.5)' }}>
            <img src="ang.JPG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'absolute', top: -7, left: -7, width: 22, height: 22,
            borderTop: '2px solid ' + DARK.pink, borderLeft: '2px solid ' + DARK.pink, opacity: 0.6 }}></div>
          <div style={{ position: 'absolute', bottom: -7, right: -7, width: 22, height: 22,
            borderBottom: '2px solid ' + DARK.blue, borderRight: '2px solid ' + DARK.blue, opacity: 0.6 }}></div>
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 44, fontWeight: 700, margin: 0, letterSpacing: '0.04em',
            fontFamily: FONT.sans }}>
            EnderJones<BlinkCursor color={DARK.pink} />
          </h1>
          <p style={{ fontSize: 14, color: DARK.mutedLight, margin: '16px 0 0', fontFamily: FONT.mono,
            letterSpacing: '0.02em' }}>
            PhD candidate @ Tokyo · Affective Computing & Multi-modal DL
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 8, position: 'relative', zIndex: 1 }}>
          {['GitHub','Twitter','Email'].map((item, i) => (
            <span key={i} style={{ fontSize: 12, color: DARK.mutedLight, fontFamily: FONT.mono,
              padding: '6px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(15,18,22,0.5)', backdropFilter: 'blur(8px)' }}>
              {item}
            </span>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 40, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8, opacity: 0.3 }}>
          <span style={{ fontSize: 10, fontFamily: FONT.mono, letterSpacing: '0.1em',
            textTransform: 'uppercase' }}>scroll</span>
          <div style={{ width: 1, height: 24, background: 'linear-gradient(to bottom, ' + DARK.text + ', transparent)' }}></div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 ' + pad + 'px', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(244,114,182,0.2) 30%, rgba(56,189,248,0.2) 70%, transparent)' }}></div>

      {/* Content */}
      <div style={{ position: 'relative', padding: '64px ' + pad + 'px' }}>
        <SectionLabel style={{ marginBottom: 32 }}>Latest Writing</SectionLabel>

        {/* Worklog Card */}
        <div style={{ marginBottom: 24, padding: '20px 24px', borderRadius: 10,
          border: '1px solid rgba(56,189,248,0.12)', background: 'rgba(56,189,248,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <SectionLabel color={DARK.blue}>Worklog / Monthly Notes</SectionLabel>
            <span style={{ fontSize: 12, color: DARK.blue, fontFamily: FONT.mono }}>Open →</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Work Archive</div>
          <div style={{ fontSize: 13, color: DARK.muted, marginBottom: 16 }}>
            Append-only notes for research, engineering, projects, and job prep.
          </div>
          <div style={{ borderRadius: 8, border: '1px solid rgba(56,189,248,0.15)', background: '#050607', overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 5, padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              alignItems: 'center' }}>
              <NavDot color="rgba(245,158,11,0.7)" size={7} />
              <NavDot color="rgba(56,189,248,0.6)" size={7} />
              <NavDot color="rgba(244,114,182,0.6)" size={7} />
              <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono, marginLeft: 'auto' }}>field-notes.md</span>
            </div>
            <pre style={{ margin: 0, padding: '10px 14px', fontSize: 12, lineHeight: 1.6,
              fontFamily: FONT.mono, color: 'rgba(219,234,254,0.8)' }}>
{`$ open work-archive
latest=2026-05 · entries=2`}
            </pre>
          </div>
        </div>

        {/* Post Grid — with images */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {POSTS.map((post, i) => (
            <div key={i} style={{ borderRadius: 10, border: '1px solid ' + (i === 0 ? 'rgba(244,114,182,0.15)' : DARK.border),
              background: DARK.surface, overflow: 'hidden', display: 'flex', minHeight: 200 }}>
              <div style={{ flex: 1, padding: '24px 24px 20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{post.title}</div>
                <div style={{ fontSize: 13, color: DARK.muted, lineHeight: 1.6, flex: 1 }}>{post.desc}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>{post.date}</span>
                  {post.tags.map((t, j) => (
                    <span key={j} style={{ fontSize: 10, color: DARK.mutedLight, fontFamily: FONT.mono,
                      padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)' }}>{t}</span>
                  ))}
                  {post.pinned && <span style={{ fontSize: 10, color: DARK.pink, fontFamily: FONT.mono }}>★ pinned</span>}
                </div>
              </div>
              {/* Real image */}
              <div style={{ width: 200, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                <img src={post.img} style={{ width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'brightness(0.85) saturate(0.9)' }} />
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, ' + DARK.surface + ' 0%, transparent 30%)' }}></div>
              </div>
            </div>
          ))}
        </div>

        <LightPalette
          colors={['#faf9f7','#ffffff','#c2185b','#0277bd','#1a1a1a','#6b7280']}
          labels={['bg','surface','primary','secondary','text','muted']}
        />
      </div>

      {/* Direction label */}
      <div style={{ position: 'absolute', top: 20, right: pad, display: 'flex', gap: 8, alignItems: 'center' }}>
        <NavDot color={DARK.pink} size={6} />
        <span style={{ fontSize: 11, fontFamily: FONT.mono, color: DARK.muted, letterSpacing: '0.05em' }}>
          Direction A — v2
        </span>
      </div>
    </div>
  );
}


// ============================================
// VARIATION B: TERMINAL INDEX (kept as-is)
// ============================================

function TerminalIndex() {
  const pad = 120;
  const amber = '#e8a848';
  const dimAmber = 'rgba(232,168,72,0.5)';

  return (
    <div style={{ width: 1440, minHeight: 2400, background: '#050505', fontFamily: FONT.mono,
      color: DARK.text, position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.015,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
        backgroundSize: '100% 4px' }} />

      <nav style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0 ' + pad + 'px',
        height: 52, gap: 4 }}>
        <div style={{ display: 'flex', gap: 6, marginRight: 24, alignItems: 'center' }}>
          <NavDot color="rgba(245,158,11,0.6)" size={8} />
          <NavDot color="rgba(56,189,248,0.5)" size={8} />
          <NavDot color="rgba(244,114,182,0.5)" size={8} />
        </div>
        {['~','posts','tags','log','about'].map((item, i) => (
          <span key={i} style={{ fontSize: 12, padding: '4px 14px', borderRadius: 4,
            color: i === 0 ? amber : DARK.muted,
            background: i === 0 ? 'rgba(232,168,72,0.08)' : 'transparent',
            border: i === 0 ? '1px solid rgba(232,168,72,0.15)' : '1px solid transparent' }}>
            [{item}]
          </span>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: DARK.blue }}>EN</span>
          <span style={{ fontSize: 11, color: DARK.muted }}>中文</span>
        </div>
      </nav>

      <div style={{ margin: '0 ' + pad + 'px', height: 1, background: 'rgba(255,255,255,0.04)' }}></div>

      <div style={{ position: 'relative', padding: pad + 'px ' + pad + 'px 60px' }}>
        <div style={{ position: 'relative', marginBottom: 48 }}>
          <h1 style={{ fontSize: 72, fontWeight: 700, margin: 0, letterSpacing: '0.06em',
            color: DARK.text, lineHeight: 1 }}>
            ENDERJONES<BlinkCursor color={amber} />
          </h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 24px', maxWidth: 600 }}>
          {[['role', 'PhD Candidate'],['location', 'Tokyo, Japan'],
            ['focus', 'Affective Computing · Multi-modal DL'],['links', null]].map(([key, val], i) => (
            <React.Fragment key={i}>
              <span style={{ color: dimAmber, fontSize: 14, textAlign: 'right' }}>{key}</span>
              {val ? <span style={{ fontSize: 14, color: DARK.mutedLight }}>{val}</span> : (
                <span style={{ fontSize: 14 }}>
                  <span style={{ color: DARK.muted }}>github</span>
                  <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 10px' }}>·</span>
                  <span style={{ color: DARK.muted }}>twitter</span>
                  <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 10px' }}>·</span>
                  <span style={{ color: DARK.muted }}>email</span>
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ position: 'absolute', right: pad, top: pad - 20 }}>
          <div style={{ width: 160, height: 160, borderRadius: 10, overflow: 'hidden',
            border: '1px solid rgba(232,168,72,0.2)', boxShadow: '0 0 48px rgba(232,168,72,0.04)' }}>
            <img src="ang.JPG" style={{ width: '100%', height: '100%', objectFit: 'cover',
              filter: 'contrast(1.05) brightness(0.95)' }} />
          </div>
        </div>
      </div>

      <div style={{ margin: '20px ' + pad + 'px 0', height: 1, background: 'rgba(255,255,255,0.04)' }}></div>

      <div style={{ position: 'relative', padding: '48px ' + pad + 'px' }}>
        <div style={{ fontSize: 12, color: DARK.muted, marginBottom: 24 }}>
          <span style={{ color: amber }}>$</span> ls posts/ --sort=date --reverse
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '20px 100px 1fr auto', gap: 16,
            padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontSize: 11, color: DARK.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <span></span><span>date</span><span>title</span><span>tags</span>
          </div>
          {POSTS.map((post, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '20px 100px 1fr auto', gap: 16,
              padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: 14, alignItems: 'center' }}>
              <span style={{ color: post.pinned ? DARK.pink : 'transparent', fontSize: 12 }}>{post.pinned ? '★' : ''}</span>
              <span style={{ color: DARK.muted, fontSize: 13 }}>{post.date}</span>
              <span style={{ color: DARK.text }}>{post.title}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {post.tags.map((t, j) => (
                  <span key={j} style={{ fontSize: 11, color: DARK.muted, padding: '2px 8px',
                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '16px ' + pad + 'px 0' }}>
        <div style={{ fontSize: 12, color: DARK.muted, marginBottom: 16 }}>
          <span style={{ color: amber }}>$</span> tail worklog/2026-05.md
        </div>
        <div style={{ borderRadius: 8, border: '1px solid rgba(232,168,72,0.15)', background: '#0a0a0a', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 5, padding: '8px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
            <NavDot color="rgba(245,158,11,0.6)" size={7} />
            <NavDot color="rgba(56,189,248,0.5)" size={7} />
            <NavDot color="rgba(244,114,182,0.5)" size={7} />
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>worklog/2026-05.md</span>
          </div>
          <div style={{ padding: '16px 20px', fontSize: 13, lineHeight: 1.8, color: 'rgba(219,234,254,0.75)' }}>
            <div><span style={{ color: amber }}>## </span><span style={{ color: DARK.text }}>Resume Here</span></div>
            <div style={{ color: DARK.muted }}>Last updated: 2026-05-09 00:47 JST</div>
            <div style={{ marginTop: 8 }}><span style={{ color: DARK.green }}>1.</span> Research: CCT-LSTM paper reproduction → stress classification</div>
            <div><span style={{ color: DARK.green }}>2.</span> Job preparation: Review 2 past exam sets</div>
            <div style={{ marginTop: 8, color: DARK.muted }}><span style={{ color: DARK.pink }}>⚠</span> Do not forget: leetcode/acm practice</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px ' + pad + 'px' }}>
        <LightPalette colors={['#fdfcfa','#f5f0e8','#b8860b','#0d6eaa','#1a1a1a','#6b7280']}
          labels={['bg','surface','primary','secondary','text','muted']} />
      </div>

      <div style={{ position: 'absolute', top: 16, right: pad, display: 'flex', gap: 8, alignItems: 'center' }}>
        <NavDot color={amber} size={6} />
        <span style={{ fontSize: 11, fontFamily: FONT.mono, color: DARK.muted, letterSpacing: '0.05em' }}>Direction B</span>
      </div>
    </div>
  );
}


// ============================================
// VARIATION C: ATMOSPHERIC (Refined v2)
// Cinematic editorial with real photos,
// large cover images, blinking cursor.
// ============================================

function Atmospheric() {
  const pad = 100;

  return (
    <div style={{ width: 1440, minHeight: 2700, background: '#080810', fontFamily: FONT.sans,
      color: DARK.text, position: 'relative', overflow: 'hidden' }}>

      {/* Atmospheric background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(800px 600px at 10% 15%, rgba(244,114,182,0.08), transparent 55%),
          radial-gradient(700px 500px at 85% 8%, rgba(56,189,248,0.06), transparent 50%),
          radial-gradient(600px 600px at 50% 75%, rgba(167,139,250,0.04), transparent 50%)` }} />

      {/* Nav */}
      <nav style={{ position: 'relative', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '0 ' + pad + 'px', height: 64 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 600, color: DARK.text,
          letterSpacing: '0.03em' }}>EJ<BlinkCursor color={DARK.purple} /></span>
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {['Home','Posts','Tags','Work Log'].map((item, i) => (
            <span key={i} style={{ fontSize: 13, color: i === 0 ? DARK.text : DARK.muted,
              fontFamily: FONT.sans, fontWeight: i === 0 ? 600 : 400 }}>{item}</span>
          ))}
          <div style={{ width: 1, height: 16, background: DARK.border, margin: '0 4px' }}></div>
          <span style={{ fontSize: 12, color: DARK.blue, fontFamily: FONT.mono }}>EN</span>
          <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>中文</span>
        </div>
      </nav>

      {/* Hero — cinematic with background image */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background image — the dusk sky, very atmospheric */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15,
          backgroundImage: `url(${POST_IMAGES.whoami})`,
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          filter: 'blur(1px) saturate(0.5)' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,8,16,0.5) 0%, rgba(8,8,16,0.85) 60%, #080810 100%)' }} />

        <div style={{ position: 'relative', padding: '100px ' + pad + 'px 80px',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 80, alignItems: 'center' }}>

          {/* Left: typography */}
          <div>
            <h1 style={{ fontSize: 100, fontWeight: 800, margin: 0, lineHeight: 0.92,
              letterSpacing: '-0.02em', fontFamily: FONT.sans }}>
              <span style={{ display: 'block', background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.65) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ender</span>
              <span style={{ display: 'block', background: 'linear-gradient(135deg, ' + DARK.pink + ' 0%, ' + DARK.blue + ' 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Jones</span>
            </h1>
            <p style={{ fontSize: 16, color: DARK.mutedLight, margin: '32px 0 0', lineHeight: 1.7, maxWidth: 440 }}>
              PhD candidate in Tokyo. Researching affective computing
              and multi-modal deep learning — trying to teach machines
              what feelings look like.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
              {['GitHub','Twitter','Email'].map((item, i) => (
                <span key={i} style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono,
                  padding: '6px 16px', borderRadius: 6, border: '1px solid ' + DARK.border,
                  background: 'rgba(255,255,255,0.02)' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: avatar with glow */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -50, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 65%)',
              filter: 'blur(24px)' }}></div>
            <div style={{ width: 240, height: 240, borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)', position: 'relative',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(244,114,182,0.06)' }}>
              <img src="ang.JPG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 48px', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.25 }}>
          <div style={{ width: 20, height: 32, borderRadius: 10, border: '1px solid ' + DARK.muted,
            display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 2, height: 6, borderRadius: 1, background: DARK.muted }}></div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 ' + pad + 'px', height: 1, position: 'relative',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)' }}></div>

      {/* Content */}
      <div style={{ position: 'relative', padding: '64px ' + pad + 'px' }}>
        <SectionLabel style={{ marginBottom: 40 }}>Latest Writing</SectionLabel>

        {/* Featured post — big cover image */}
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(244,114,182,0.1)',
          background: DARK.surface, marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Image side */}
          <div style={{ position: 'relative', minHeight: 300 }}>
            <img src={POSTS[0].img} style={{ width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.75) saturate(0.85)' }} />
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent 60%, ' + DARK.surface + ' 100%)' }}></div>
          </div>
          {/* Content side */}
          <div style={{ padding: '36px 36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {POSTS[0].pinned && (
              <span style={{ fontSize: 10, color: DARK.pink, fontFamily: FONT.mono,
                letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>★ Pinned</span>
            )}
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3 }}>{POSTS[0].title}</h2>
            <p style={{ fontSize: 14, color: DARK.mutedLight, lineHeight: 1.7, margin: '0 0 20px' }}>{POSTS[0].desc}</p>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>{POSTS[0].date}</span>
              {POSTS[0].tags.map((t, j) => (
                <span key={j} style={{ fontSize: 10, color: DARK.mutedLight, fontFamily: FONT.mono,
                  padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Remaining posts — 3 column with real images */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {POSTS.slice(1).map((post, i) => (
            <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid ' + DARK.border,
              background: DARK.surface }}>
              <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
                <img src={post.img} style={{ width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'brightness(0.8) saturate(0.85)' }} />
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, ' + DARK.surface + ' 0%, transparent 40%)' }}></div>
              </div>
              <div style={{ padding: '18px 20px 22px' }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{post.title}</div>
                <div style={{ fontSize: 13, color: DARK.muted, lineHeight: 1.5, marginBottom: 12 }}>{post.desc}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>{post.date}</span>
                  {post.tags.map((t, j) => (
                    <span key={j} style={{ fontSize: 10, color: DARK.mutedLight, fontFamily: FONT.mono,
                      padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Worklog */}
        <div style={{ marginTop: 40, padding: '24px 28px', borderRadius: 10,
          border: '1px solid rgba(167,139,250,0.12)', background: 'rgba(167,139,250,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <SectionLabel color={DARK.purple}>Work Archive</SectionLabel>
            <span style={{ fontSize: 12, color: DARK.purple, fontFamily: FONT.mono }}>View all →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
            {[['Status','Writing paper'],['Next','Submit & review'],['Updated','2026-05-09']].map(([label, val], i) => (
              <div key={i} style={{ padding: '14px 16px', borderRadius: 8,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono, marginBottom: 6,
                  textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        <LightPalette
          colors={['#f8f7f4','#ffffff','#ad1457','#1565c0','#7b1fa2','#1a1a1a']}
          labels={['bg','surface','pink','blue','purple','text']}
        />
      </div>

      {/* Direction label */}
      <div style={{ position: 'absolute', top: 20, right: pad, display: 'flex', gap: 8, alignItems: 'center' }}>
        <NavDot color={DARK.purple} size={6} />
        <span style={{ fontSize: 11, fontFamily: FONT.mono, color: DARK.muted, letterSpacing: '0.05em' }}>
          Direction C — v2
        </span>
      </div>
    </div>
  );
}


// ============================================
// AUTHOR RAIL — shared across post / archive / worklog pages
// Reads from data/site.yml. Sticky left column on desktop.
// Mobile: collapses into a small author strip near the footer.
// Homepage uses the Identity tile instead — never both.
// ============================================
function AuthorRail({ compact = false, currentThread = null }) {
  return (
    <aside style={{ position: 'sticky', top: 100, alignSelf: 'flex-start',
      height: 'fit-content', width: compact ? 180 : 200,
      display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Avatar + name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 20px rgba(244,114,182,0.08)' }}>
          <img src="ang.JPG" alt="EnderJones"
            style={{ width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.95)' }} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
            EnderJones
          </div>
          <div style={{ fontSize: 11, color: DARK.mutedLight, fontFamily: FONT.mono,
            lineHeight: 1.5 }}>
            PhD candidate<br />Tokyo, Japan
          </div>
        </div>
      </div>

      {/* Research one-liner */}
      <div style={{ paddingTop: 14, borderTop: '1px solid ' + DARK.border }}>
        <div style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
          letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
          Researching
        </div>
        <div style={{ fontSize: 12, color: '#cfd5dd', lineHeight: 1.6,
          fontFamily: 'Georgia, serif', textWrap: 'pretty' }}>
          Stress detection from multi-modal physiological signals.
        </div>
      </div>

      {/* Optional Current Thread one-liner — research-continuity peek */}
      {currentThread && (
        <div style={{ paddingTop: 14, borderTop: '1px solid ' + DARK.border }}>
          <div style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            Current thread
          </div>
          <div style={{ fontSize: 11, color: DARK.mutedLight, lineHeight: 1.65,
            textWrap: 'pretty' }}>
            {currentThread}
          </div>
          <div style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
            marginTop: 8 }}>
            updated 4d ago · open worklog →
          </div>
        </div>
      )}

      {/* Contact / socials */}
      <div style={{ paddingTop: 14, borderTop: '1px solid ' + DARK.border,
        display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Reach me
        </div>
        {[
          ['github', '@enderjones', DARK.mutedLight],
          ['twitter', '@enderjones', DARK.mutedLight],
          ['email', 'hi@…', DARK.blue],
          ['rss', '/feed.xml', DARK.muted],
        ].map(([k, v, c], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', fontSize: 11, fontFamily: FONT.mono }}>
            <span style={{ color: DARK.muted }}>{k}</span>
            <span style={{ color: c }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
        opacity: 0.55, lineHeight: 1.6, paddingTop: 8 }}>
        data/site.yml · sticky on ≥ 1024px
      </div>
    </aside>
  );
}

// Compact horizontal author strip — used at the bottom of pages on mobile,
// or wherever a full rail would be overkill.
function AuthorStrip() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center',
      padding: '20px 24px', borderRadius: 12,
      border: '1px solid ' + DARK.border, background: DARK.surface }}>
      <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <img src="ang.JPG" alt="EnderJones"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
          EnderJones · <span style={{ color: DARK.mutedLight, fontWeight: 400 }}>
            PhD candidate, Tokyo
          </span>
        </div>
        <div style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
          lineHeight: 1.6 }}>
          affective computing · multi-modal DL · stress detection
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {['github','twitter','email','rss'].map((s, i) => (
          <span key={i} style={{ fontSize: 11, color: DARK.mutedLight, fontFamily: FONT.mono,
            padding: '4px 10px', borderRadius: 6,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid ' + DARK.border }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { QuietGrid, TerminalIndex, Atmospheric, AuthorRail, AuthorStrip });
