// ============================================
// POST DETAIL PAGE — /posts/:slug/
// Reading-first. Sticky TOC (desktop). Reading progress.
// Cover system: hero-large | hero-small | strip | inline | none
// Optional Giscus comments via frontmatter `comments: true`.
// ============================================

// ---------- Helpers ----------
function PostNav({ slug }) {
  const pad = 80;
  return (
    <nav style={{ position: 'relative', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '0 ' + pad + 'px', height: 64,
      borderBottom: '1px solid ' + DARK.border }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, letterSpacing: '0.02em' }}>
          EnderJones<BlinkCursor color={DARK.pink} />
        </span>
        <span style={{ color: DARK.muted, fontSize: 12 }}>/</span>
        <span style={{ fontSize: 12, color: DARK.mutedLight, fontFamily: FONT.mono }}>posts</span>
        <span style={{ color: DARK.muted, fontSize: 12 }}>/</span>
        <span style={{ fontSize: 12, color: '#fff', fontFamily: FONT.mono,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
          {slug}
        </span>
      </div>
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
  );
}

function ReadingProgress({ pct = 34 }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 100,
      background: 'rgba(255,255,255,0.04)' }}>
      <div style={{ width: pct + '%', height: '100%',
        background: 'linear-gradient(90deg, ' + DARK.pink + ', ' + DARK.blue + ')',
        boxShadow: '0 0 10px rgba(244,114,182,0.4)' }}></div>
    </div>
  );
}

// ---------- COVER VARIANTS ----------

function CoverHeroLarge({ post }) {
  const pad = 80;
  return (
    <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
      <img src={post.img} style={{ width: '100%', height: '100%', objectFit: 'cover',
        objectPosition: post.focus || 'center 40%', filter: 'brightness(0.7) saturate(0.95)' }} />
      <div style={{ position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(7,8,9,0.3) 0%, rgba(7,8,9,0.92) 100%)' }}></div>
      <div style={{ position: 'absolute', bottom: 44, left: pad, right: pad, zIndex: 2 }}>
        <SectionLabel color={DARK.pink} style={{ marginBottom: 16 }}>
          ★ Pinned · Essay · {post.year}
        </SectionLabel>
        <h1 style={{ fontSize: 56, fontWeight: 800, margin: 0, lineHeight: 1.1,
          letterSpacing: '-0.02em', maxWidth: 880, color: '#fff' }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 18, color: DARK.mutedLight, margin: '14px 0 0',
          lineHeight: 1.6, maxWidth: 720, fontWeight: 300 }}>
          {post.dek}
        </p>
        <PostMeta post={post} light />
      </div>
    </div>
  );
}

function CoverHeroSmall({ post }) {
  const pad = 80;
  return (
    <>
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <img src={post.img} style={{ width: '100%', height: '100%', objectFit: 'cover',
          objectPosition: post.focus || 'center', filter: 'brightness(0.78) saturate(0.92)' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(7,8,9,0.85) 100%)' }}></div>
        {post.image_alt && (
          <div style={{ position: 'absolute', bottom: 10, right: pad, fontSize: 10,
            color: 'rgba(255,255,255,0.5)', fontFamily: FONT.mono, letterSpacing: '0.04em' }}>
            ↳ {post.image_alt}
          </div>
        )}
      </div>
      {/* Title sits BELOW the image — better hierarchy for non-hero covers */}
      <div style={{ padding: '40px ' + pad + 'px 0' }}>
        <SectionLabel color={DARK.muted} style={{ marginBottom: 14 }}>
          Essay · {post.year}
        </SectionLabel>
        <h1 style={{ fontSize: 44, fontWeight: 800, margin: 0, lineHeight: 1.15,
          letterSpacing: '-0.02em', maxWidth: 860, color: '#fff' }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 17, color: DARK.mutedLight, margin: '14px 0 0',
          lineHeight: 1.6, maxWidth: 720, fontWeight: 300 }}>
          {post.dek}
        </p>
        <PostMeta post={post} />
      </div>
    </>
  );
}

function CoverStrip({ post }) {
  const pad = 80;
  return (
    <>
      {/* Thin atmospheric strip — image used as mood, not content */}
      <div style={{ position: 'relative', height: 90, overflow: 'hidden' }}>
        <img src={post.img} style={{ width: '100%', height: '100%', objectFit: 'cover',
          objectPosition: post.focus || 'center', filter: 'brightness(0.45) saturate(0.85) blur(2px)' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(7,8,9,0.4) 0%, rgba(7,8,9,0.95) 100%)' }}></div>
      </div>
      <div style={{ padding: '52px ' + pad + 'px 0' }}>
        <SectionLabel color={DARK.muted} style={{ marginBottom: 14 }}>
          Note · {post.year}
        </SectionLabel>
        <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0, lineHeight: 1.15,
          letterSpacing: '-0.02em', maxWidth: 800, color: '#fff' }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 16, color: DARK.mutedLight, margin: '14px 0 0',
          lineHeight: 1.6, maxWidth: 680, fontWeight: 300 }}>
          {post.dek}
        </p>
        <PostMeta post={post} />
      </div>
    </>
  );
}

function CoverShowcase({ post }) {
  const pad = 80;
  return (
    <>
      {/* Title FIRST — the photograph stays a visual object, not a backdrop */}
      <div style={{ padding: '56px ' + pad + 'px 32px' }}>
        <SectionLabel color={DARK.pink} style={{ marginBottom: 14 }}>
          ❋ Showcase · {post.year}
        </SectionLabel>
        <h1 style={{ fontSize: 48, fontWeight: 800, margin: 0, lineHeight: 1.12,
          letterSpacing: '-0.02em', maxWidth: 880, color: '#fff' }}>
          {post.title}
        </h1>
        <p style={{ fontSize: 17, color: DARK.mutedLight, margin: '14px 0 0',
          lineHeight: 1.6, maxWidth: 720, fontWeight: 300 }}>
          {post.dek}
        </p>
        <PostMeta post={post} />
      </div>

      {/* The photograph itself — full composition, framed, captioned */}
      <figure style={{ maxWidth: 960, margin: '24px auto 0', padding: '0 24px' }}>
        <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02)' }}>
          <img src={post.img} alt={post.image_alt || post.title}
            style={{ width: '100%', height: 'auto', display: 'block',
              objectFit: 'contain', maxHeight: 560,
              filter: 'brightness(0.97) saturate(1.02)' }} />
        </div>
        <figcaption style={{ marginTop: 14, fontSize: 11, color: DARK.muted,
          fontFamily: FONT.mono, lineHeight: 1.6, textAlign: 'center',
          letterSpacing: '0.02em' }}>
          {post.image_alt || '— untitled —'}
          {post.image_credit && (
            <span style={{ color: DARK.mutedLight }}> · {post.image_credit}</span>
          )}
        </figcaption>
      </figure>
    </>
  );
}

function CoverNone({ post }) {
  const pad = 80;
  return (
    <div style={{ padding: '72px ' + pad + 'px 0' }}>
      <SectionLabel color={DARK.muted} style={{ marginBottom: 18 }}>
        Note · {post.year}
      </SectionLabel>
      <h1 style={{ fontSize: 44, fontWeight: 800, margin: 0, lineHeight: 1.15,
        letterSpacing: '-0.02em', maxWidth: 860, color: '#fff' }}>
        {post.title}
      </h1>
      <p style={{ fontSize: 17, color: DARK.mutedLight, margin: '14px 0 0',
        lineHeight: 1.6, maxWidth: 720, fontWeight: 300 }}>
        {post.dek}
      </p>
      <PostMeta post={post} />
    </div>
  );
}

function PostMeta({ post, light = false }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginTop: 24, alignItems: 'center',
      fontFamily: FONT.mono, fontSize: 12, color: light ? DARK.mutedLight : DARK.muted,
      flexWrap: 'wrap' }}>
      <span>{post.date}</span>
      <span style={{ color: DARK.muted }}>·</span>
      <span>{post.readTime}</span>
      {post.i18n && (
        <>
          <span style={{ color: DARK.muted }}>·</span>
          <span style={{ color: DARK.blue }}>中文 version →</span>
        </>
      )}
      <span style={{ color: DARK.muted }}>·</span>
      {post.tags.map((t, j) => (
        <span key={j} style={{ color: light ? '#fff' : '#cfd5dd',
          padding: '2px 8px', borderRadius: 4,
          background: 'rgba(255,255,255,0.05)' }}>#{t}</span>
      ))}
    </div>
  );
}

function CoverDispatch({ mode, post }) {
  if (mode === 'hero-large') return <CoverHeroLarge post={post} />;
  if (mode === 'hero-small') return <CoverHeroSmall post={post} />;
  if (mode === 'showcase')   return <CoverShowcase post={post} />;
  if (mode === 'strip')      return <CoverStrip post={post} />;
  if (mode === 'none')       return <CoverNone post={post} />;
  return <CoverHeroSmall post={post} />;
}

// ---------- Body (shared) ----------
function PostBody({ withComments = false, showInlineFigure = true }) {
  return (
    <article style={{ maxWidth: 720, margin: '0 auto', fontSize: 16, lineHeight: 1.85,
      color: '#dde1e6', fontWeight: 400 }}>

      <div style={{ margin: '0 0 36px', padding: '22px 26px',
        background: 'rgba(255,255,255,0.02)',
        borderLeft: '3px solid ' + DARK.pink, borderRadius: '0 8px 8px 0' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15,
          lineHeight: 1.7, color: '#d4d8de', margin: 0, textWrap: 'pretty' }}>
          Je n'ai que ma douleur et je ne veux plus qu'elle.<br />
          Elle m'a été, elle m'est encore fidèle.<br />
          Pourquoi lui en voudrais-je, puisqu'aux heures<br />
          où mon âme broyait le dessous de mon cœur,<br />
          elle se trouvait là assise à mon côté ?
        </p>
        <div style={{ marginTop: 14, fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
          textAlign: 'right' }}>
          — Francis Jammes, "Prière pour aimer la douleur"
        </div>
      </div>

      <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 18px', color: '#fff',
        letterSpacing: '-0.01em' }}>
        A New Start
      </h2>
      <p style={{ margin: '0 0 18px' }}>
        The memories of the past few years have reshaped my life and mind. My loved one left me.
        I surrendered most of my heart and essence to her, leaving nothing for myself.
      </p>
      <p style={{ margin: '0 0 18px' }}>
        Yet, I refuse to surrender — not on her, not on my life. With the beginning of my
        doctoral program as a researcher, <strong style={{ color: '#fff' }}>I must chart a new path</strong>.
      </p>
      <p style={{ margin: '0 0 32px' }}>
        For my family, for the one I still love, for my friends, for the students I mentor,
        and ultimately, for myself.
      </p>

      <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 18px', color: '#fff',
        letterSpacing: '-0.01em' }}>
        Who am I?
      </h2>

      <h3 style={{ fontSize: 20, fontWeight: 700, margin: '24px 0 14px', color: '#fff' }}>
        Life
      </h3>

      {showInlineFigure && (
        <figure style={{ float: 'right', width: 280, margin: '8px 0 16px 28px' }}>
          <div style={{ borderRadius: 10, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)' }}>
            <img src={POST_IMAGES.yokosuka} style={{ width: '100%', height: 200,
              objectFit: 'cover', display: 'block' }} />
          </div>
          <figcaption style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
            marginTop: 8, lineHeight: 1.5 }}>
            ↳ Yokosuka — seven years. <em style={{ color: DARK.mutedLight }}>
              image_role: semantic</em>
          </figcaption>
        </figure>
      )}

      <p style={{ margin: '0 0 18px' }}>
        In my younger years, the world seemed much smaller. I studied at my old school with
        consistently poor grades and had a crush on someone who never even acknowledged me as
        a normal person.
      </p>
      <p style={{ margin: '0 0 18px' }}>
        It struck me when my father remarked during my middle school years, "I noticed you're
        not as outgoing as you were at 10."
      </p>

      <div style={{ margin: '28px 0', borderRadius: 10, overflow: 'hidden',
        border: '1px solid rgba(56,189,248,0.15)', background: '#05070a', clear: 'both' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(56,189,248,0.04)',
          borderBottom: '1px solid rgba(56,189,248,0.1)',
          fontSize: 11, fontFamily: FONT.mono }}>
          <span style={{ color: DARK.blue, fontWeight: 600 }}>python · model.py</span>
          <span style={{ color: DARK.muted }}>copy ⌘</span>
        </div>
        <pre style={{ margin: 0, padding: '16px 18px', fontSize: 13, lineHeight: 1.65,
          fontFamily: FONT.mono, color: 'rgba(219,234,254,0.9)' }}>
{`class CCTLSTM(nn.Module):
    """Compact Convolutional Transformer + LSTM."""
    def __init__(self, num_classes=3):
        super().__init__()
        self.cct = CCT(seq_len=128, dim=192)
        self.lstm = nn.LSTM(192, 96, batch_first=True)
        self.head = nn.Linear(96, num_classes)`}
        </pre>
      </div>

      <p style={{ margin: '0 0 18px' }}>
        Today, I still ask myself that same question again and again: "What did I do wrong?
        How could she do this? Am I trying my best?"
      </p>

      {/* prev/next */}
      <div style={{ marginTop: 48, paddingTop: 28, borderTop: '1px solid ' + DARK.border }}>
        <SectionLabel color={DARK.pink} style={{ marginBottom: 14 }}>Continue reading</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ padding: '16px 18px', borderRadius: 10,
            border: '1px solid ' + DARK.border, background: DARK.surface }}>
            <div style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
              marginBottom: 6 }}>← previous · 2025.04</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
              Setting up the blog
            </div>
          </div>
          <div style={{ padding: '16px 18px', borderRadius: 10,
            border: '1px solid ' + DARK.border, background: DARK.surface,
            textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
              marginBottom: 6 }}>next → · 2025.05</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
              Regression Model Metrics
            </div>
          </div>
        </div>
      </div>

      {/* Optional Giscus block */}
      {withComments && <GiscusBlock />}
    </article>
  );
}

function GiscusBlock() {
  return (
    <section style={{ marginTop: 56, paddingTop: 28, borderTop: '1px solid ' + DARK.border }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 18 }}>
        <SectionLabel>Comments</SectionLabel>
        <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>
          via Giscus · sign in with GitHub
        </span>
      </div>
      {/* Mock giscus iframe — visually calm, matching site palette */}
      <div style={{ borderRadius: 10, border: '1px solid ' + DARK.border,
        background: DARK.surface, padding: '20px 22px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start',
          paddingBottom: 18, borderBottom: '1px solid ' + DARK.border, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #2a3142, #1a1f2a)', flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.08)' }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>@somereader</span>
              <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
                2025.05.02
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#cfd5dd', lineHeight: 1.65, margin: 0 }}>
              Resonated with this — especially the Yokosuka section. Thanks for writing it.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start',
          paddingBottom: 18, borderBottom: '1px solid ' + DARK.border, marginBottom: 18 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #3a2538, #1f1a25)', flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.08)' }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>@anotherone</span>
              <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
                2025.05.04
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#cfd5dd', lineHeight: 1.65, margin: 0 }}>
              Good to see a PhD candidate writing publicly like this. Are you planning to
              share more on the CCT-LSTM work?
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center',
          padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.025)',
          border: '1px solid ' + DARK.border }}>
          <span style={{ fontSize: 13, color: DARK.muted, flex: 1 }}>
            Write a comment…
          </span>
          <span style={{ fontSize: 11, color: DARK.blue, fontFamily: FONT.mono }}>
            sign in with GitHub →
          </span>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
        textAlign: 'center' }}>
        ↳ lazy-loaded · only mounts when scrolled into view · frontmatter: comments: true
      </div>
    </section>
  );
}

// ---------- TOC (desktop only) ----------
function TOC({ wordCount = 2847, readTime = 8, i18n = false }) {
  return (
    <aside style={{ position: 'sticky', top: 100, alignSelf: 'flex-start', height: 'fit-content' }}>
      <div style={{ padding: '20px 0', borderLeft: '1px solid ' + DARK.border, paddingLeft: 20 }}>
        <SectionLabel style={{ marginBottom: 18 }}>On this page</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['A New Start', false, 0],
            ['Who am I?', true, 0],
            ['Life', false, 1],
            ['Work', false, 1],
            ['Why English?', false, 1],
          ].map(([title, active, indent], i) => (
            <div key={i} style={{ display: 'flex', gap: 10,
              paddingLeft: (indent || 0) * 14 }}>
              <div style={{ width: 2, height: 'auto', alignSelf: 'stretch', borderRadius: 1,
                background: active ? DARK.pink : 'rgba(255,255,255,0.06)',
                boxShadow: active ? '0 0 6px ' + DARK.pink : 'none' }}></div>
              <span style={{ fontSize: 12, lineHeight: 1.5,
                color: active ? '#fff' : DARK.mutedLight,
                fontWeight: active ? 600 : 400 }}>
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 24, padding: '16px 0', borderTop: '1px solid ' + DARK.border,
        fontSize: 11, color: DARK.muted, fontFamily: FONT.mono, lineHeight: 1.9 }}>
        <div>{wordCount.toLocaleString()} words</div>
        <div>{readTime} min read</div>
        {i18n && <div style={{ marginTop: 10, color: DARK.blue }}>↳ 中文 version</div>}
        <div style={{ color: DARK.mutedLight }}>↳ share · cite · raw</div>
      </div>
      <div style={{ marginTop: 18, padding: '12px 0', fontSize: 10, color: DARK.muted,
        fontFamily: FONT.mono, opacity: 0.7 }}>
        TOC visible ≥ 1024px · collapses to ▾ on mobile
      </div>
    </aside>
  );
}

// ============================================
// MAIN POST PAGE — hero-large, with comments
// ============================================

const WHOAMI_POST = {
  slug: 'who-am-i',
  title: 'Who Am I?',
  dek: 'A kid wanted to be a scientist, but lost precious things on the road.',
  date: '2025.04.29', year: '2025',
  readTime: '8 min read',
  i18n: true,
  tags: ['blogging','others'],
  img: POST_IMAGES.whoami,
  focus: 'center 40%',
  image_alt: 'photographed at home, 2025',
};

function PostDetailPage() {
  const pad = 80;
  return (
    <div style={{ width: 1440, minHeight: 2400, background: '#070809', fontFamily: FONT.sans,
      color: DARK.text, position: 'relative', overflow: 'hidden' }}>

      <ReadingProgress pct={34} />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.015) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.015) 1px, transparent 1px),
          radial-gradient(800px 600px at 80% 5%, rgba(56,189,248,0.035), transparent 60%)`,
        backgroundSize: '40px 40px, 40px 40px, 100% 100%' }} />

      <PostNav slug="who-am-i" />

      <CoverDispatch mode="hero-large" post={WHOAMI_POST} />

      {/* 3-col layout: AuthorRail (left) + article (center) + TOC (right) */}
      <div style={{ position: 'relative', padding: '60px ' + pad + 'px',
        display: 'grid', gridTemplateColumns: '180px 1fr 200px', gap: 40 }}>
        <AuthorRail compact={true} currentThread="EDA-augmented stress classification, paper iteration." />
        <PostBody withComments={true} />
        <TOC wordCount={2847} readTime={8} i18n={true} />
      </div>

      <div style={{ padding: '40px ' + pad + 'px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          fontFamily: FONT.mono, fontSize: 12 }}>
          <span style={{ color: DARK.muted }}>© 2026 EnderJones</span>
          <div style={{ display: 'flex', gap: 18 }}>
            {['github','twitter','email','rss'].map((s, i) => (
              <span key={i} style={{ color: DARK.mutedLight }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 24, left: pad - 30, display: 'flex', gap: 8,
        alignItems: 'center', zIndex: 20 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: DARK.purple,
          boxShadow: '0 0 8px ' + DARK.purple }}></div>
        <span style={{ fontSize: 10, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Post · cover_mode: hero-large · comments: true
        </span>
      </div>
    </div>
  );
}

// ============================================
// COVER MODE VARIANTS — alternate artboards
// Each shows the SAME post under a different cover_mode.
// ============================================

function makeMockPost(mode) {
  const base = {
    'hero-small': {
      slug: 'cct-lstm-eval',
      title: 'CCT-LSTM Evaluation Round 2: What Changed',
      dek: 'A short write-up on the second-round evaluation of CCT-LSTM under EDA augmentation, with results and remaining concerns.',
      date: '2026.05.07', year: '2026', readTime: '6 min read',
      i18n: false, tags: ['research','ML'], img: POST_IMAGES.regression,
      focus: 'center', image_alt: 'training curves screenshot — semantic',
    },
    'showcase': {
      slug: 'cherry-blossoms-yokosuka',
      title: 'Cherry Blossoms, Yokosuka',
      dek: 'A short photo essay on the cherry blossoms along the harbour wall this year.',
      date: '2026.04.04', year: '2026', readTime: '3 min read',
      i18n: false, tags: ['photo','memory'], img: POST_IMAGES.poem,
      image_alt: 'Cherry blossoms along the harbour wall, Yokosuka — 2026.04',
      image_credit: 'photographed by author',
    },
    'strip': {
      slug: 'what-distance-taught-us',
      title: 'What Distance Taught Us',
      dek: 'A short poem on seasons, distance, and memory.',
      date: '2026.05.07', year: '2026', readTime: '2 min read',
      i18n: false, tags: ['poem','memory'], img: POST_IMAGES.poem,
      focus: 'center',
    },
    'none': {
      slug: 'edas-and-the-shape-of-stress',
      title: 'EDAs and the Shape of Stress: a Quick Note',
      dek: 'A short, image-free note on what electrodermal activity windows actually look like across stress classes.',
      date: '2026.04.12', year: '2026', readTime: '4 min read',
      i18n: false, tags: ['research','EDA'],
    },
  };
  return base[mode];
}

function PostCoverVariants() {
  const pad = 80;

  const Variant = ({ mode, post, label, height = 720 }) => (
    <div style={{ width: 1380, marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 10, padding: '0 6px' }}>
        <span style={{ fontSize: 11, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>
          frontmatter → cover_mode: {mode}
        </span>
      </div>
      <div style={{ width: '100%', height, background: '#070809', borderRadius: 12,
        overflow: 'hidden', border: '1px solid ' + DARK.border, position: 'relative' }}>
        <PostNav slug={post.slug} />
        <CoverDispatch mode={mode} post={post} />
        {/* Body sample — first 2 paragraphs only, to keep frame readable */}
        <div style={{ padding: '40px ' + pad + 'px',
          display: 'grid', gridTemplateColumns: '1fr 200px', gap: 48 }}>
          <article style={{ maxWidth: 700, margin: '0 auto', fontSize: 15, lineHeight: 1.85,
            color: '#dde1e6' }}>
            <p style={{ margin: '0 0 16px' }}>
              {post.slug === 'what-distance-taught-us'
                ? 'The body begins after a thin atmospheric strip — the image sets mood, but the reading experience opens calm and text-first. Typography carries the page, not the photograph.'
                : post.slug === 'edas-and-the-shape-of-stress'
                  ? 'No image at the top, just title + dek + meta. The page opens straight into the writing — appropriate for short notes, technical jots, and posts where no photo would help.'
                  : 'The image lives above the title, sized just large enough to set a tone without claiming to be a magazine cover. Good default for most posts with a casual or representative image.'}
            </p>
            <p style={{ margin: '0 0 16px', color: DARK.mutedLight }}>
              Body, code blocks, marginalia and the rest render identically across all
              cover_mode variants — only the opener changes.
            </p>
          </article>
          <aside style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
            lineHeight: 1.9, opacity: 0.6 }}>
            <div>On this page</div>
            <div style={{ marginTop: 8, color: DARK.mutedLight }}>· Intro</div>
            <div style={{ color: DARK.mutedLight }}>· Method</div>
            <div style={{ color: DARK.mutedLight }}>· Results</div>
          </aside>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ width: 1440, padding: '32px 30px', background: '#070809',
      fontFamily: FONT.sans, color: DARK.text }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: DARK.purple,
          boxShadow: '0 0 8px ' + DARK.purple }}></div>
        <span style={{ fontSize: 11, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Post · cover_mode variants
        </span>
      </div>
      <p style={{ fontSize: 13, color: DARK.mutedLight, maxWidth: 800, marginBottom: 28,
        lineHeight: 1.7 }}>
        Five cover modes total. <code style={{ fontFamily: FONT.mono, fontSize: 12,
          color: DARK.purple }}>hero-large</code> is the primary post above. Below are{' '}
        <code style={{ fontFamily: FONT.mono, fontSize: 12, color: DARK.purple }}>hero-small</code>,{' '}
        <code style={{ fontFamily: FONT.mono, fontSize: 12, color: DARK.purple }}>showcase</code>,{' '}
        <code style={{ fontFamily: FONT.mono, fontSize: 12, color: DARK.purple }}>strip</code>, and{' '}
        <code style={{ fontFamily: FONT.mono, fontSize: 12, color: DARK.purple }}>none</code>.
        Defaults: <em>no image</em> → none · <em>image set, no mode</em> → hero-small ·{' '}
        <em>pinned + image</em> → hero-large · <em>showcase</em> is opt-in for photographic posts.
      </p>
      <Variant mode="hero-small" post={makeMockPost('hero-small')}
        label="② hero-small · default for most posts with an image" height={760} />
      <Variant mode="showcase" post={makeMockPost('showcase')}
        label="③ showcase · full composition · for photographic / atmospheric posts" height={980} />
      <Variant mode="strip" post={makeMockPost('strip')}
        label="④ strip · image is mood only · used for poems, short notes" height={680} />
      <Variant mode="none" post={makeMockPost('none')}
        label="⑤ none · text-only opener · used for short notes & technical jots" height={620} />
    </div>
  );
}

Object.assign(window, { PostDetailPage, PostCoverVariants });
