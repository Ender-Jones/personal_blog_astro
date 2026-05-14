// ============================================
// VARIATION D: EDITORIAL (Recommended)
// Personal magazine-style cover.
// Full-screen cinematic hero + "Currently" status
// block + literary quote + clean archive.
// ============================================

function Editorial() {
  const pad = 88;

  return (
    <div style={{ width: 1440, minHeight: 3000, background: '#070809', fontFamily: FONT.sans,
      color: DARK.text, position: 'relative', overflow: 'hidden' }}>

      {/* ============ FULL-SCREEN CINEMATIC HERO ============ */}
      <div style={{ position: 'relative', height: 900, overflow: 'hidden' }}>

        {/* Hero photograph */}
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: `url(${POST_IMAGES.whoami})`,
          backgroundSize: 'cover', backgroundPosition: 'center 35%',
          filter: 'saturate(0.85) brightness(0.55) contrast(1.05)' }} />

        {/* Multi-layer cinematic gradient overlay */}
        <div style={{ position: 'absolute', inset: 0,
          background: `
            linear-gradient(180deg, rgba(7,8,9,0.35) 0%, rgba(7,8,9,0.55) 50%, rgba(7,8,9,0.98) 100%),
            radial-gradient(800px 500px at 25% 30%, rgba(244,114,182,0.14), transparent 65%),
            radial-gradient(700px 500px at 80% 60%, rgba(56,189,248,0.1), transparent 60%)` }} />

        {/* Subtle grid overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.5,
          backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.03) 1px, transparent 1px)`,
          backgroundSize: '48px 48px' }} />

        {/* Nav (floats over hero) */}
        <nav style={{ position: 'relative', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '0 ' + pad + 'px', height: 72, zIndex: 10 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, letterSpacing: '0.02em' }}>
            EnderJones<BlinkCursor color={DARK.pink} />
          </span>

          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {['Posts','Tags','Archive','Work Log','About'].map((item, i) => (
              <span key={i} style={{ fontSize: 13, color: DARK.mutedLight, fontFamily: FONT.mono,
                letterSpacing: '0.02em' }}>{item}</span>
            ))}
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)', margin: '0 4px' }}></div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '4px 10px',
              borderRadius: 6, background: 'rgba(15,18,22,0.5)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 11, color: DARK.blue, fontFamily: FONT.mono, fontWeight: 600 }}>EN</span>
              <span style={{ fontSize: 11, color: DARK.muted }}>·</span>
              <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>中</span>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 6,
              background: 'rgba(15,18,22,0.5)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: DARK.amber }}>☾</span>
            </div>
          </div>
        </nav>

        {/* Hero centerpiece */}
        <div style={{ position: 'relative', zIndex: 5, padding: '90px ' + pad + 'px',
          display: 'grid', gridTemplateColumns: '1fr', maxWidth: 1100 }}>

          {/* Top kicker with neon line + avatar byline */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 36 }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden',
              border: '1px solid rgba(244,114,182,0.4)',
              boxShadow: '0 0 24px rgba(244,114,182,0.25), 0 0 1px rgba(56,189,248,0.3)' }}>
              <img src="ang.JPG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SectionLabel color={DARK.pink} style={{ textShadow: '0 0 12px rgba(244,114,182,0.5)' }}>
                Personal Archive · № 01
              </SectionLabel>
              <span style={{ fontSize: 11, color: DARK.mutedLight, fontFamily: FONT.mono,
                letterSpacing: '0.05em' }}>
                est. 2025 · Tokyo
              </span>
            </div>
            <div style={{ flex: 1, height: 1, marginLeft: 8,
              background: 'linear-gradient(90deg, rgba(244,114,182,0.4), rgba(56,189,248,0.2), transparent)' }}></div>
          </div>

          {/* Big name */}
          <h1 style={{ fontSize: 132, fontWeight: 800, margin: 0, lineHeight: 0.9,
            letterSpacing: '-0.03em', fontFamily: FONT.sans, color: '#fff' }}>
            Ender<br />
            <span style={{ background: 'linear-gradient(135deg, ' + DARK.pink + ' 0%, ' + DARK.blue + ' 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 32px rgba(244,114,182,0.25))' }}>Jones</span>
            <BlinkCursor color={DARK.pink} />
          </h1>

          {/* Subtitle — short, with neon highlight */}
          <p style={{ fontSize: 19, color: '#cfd5dd', margin: '32px 0 0', lineHeight: 1.5,
            maxWidth: 520, fontWeight: 300 }}>
            Research notes from Tokyo on{' '}
            <span style={{ color: DARK.pink, fontWeight: 500,
              textShadow: '0 0 16px rgba(244,114,182,0.35)' }}>affective computing</span>
            {' '}&{' '}
            <span style={{ color: DARK.blue, fontWeight: 500,
              textShadow: '0 0 16px rgba(56,189,248,0.35)' }}>multi-modal DL</span>.
          </p>

          {/* Meta chips */}
          <div style={{ display: 'flex', gap: 12, marginTop: 40, alignItems: 'center',
            fontFamily: FONT.mono, fontSize: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 14px',
              borderRadius: 999, background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.2)' }}>
              <NavDot color={DARK.green} size={6} />
              <span style={{ color: '#a7e8c8' }}>online · in Tokyo</span>
            </div>
            <div style={{ padding: '6px 14px', borderRadius: 999,
              background: 'rgba(15,18,22,0.5)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: DARK.mutedLight }}>EN · 中文</span>
            </div>
            <div style={{ padding: '6px 14px', borderRadius: 999,
              background: 'rgba(15,18,22,0.5)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: DARK.mutedLight }}>last update <span style={{ color: '#fff' }}>2026.05.09</span></span>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator with caption */}
        <div style={{ position: 'absolute', bottom: 36, left: pad, right: pad,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
          <div style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
            letterSpacing: '0.08em', maxWidth: 280, lineHeight: 1.7 }}>
            <span style={{ color: DARK.pink, textShadow: '0 0 12px rgba(244,114,182,0.4)' }}>『 cover 』</span><br />
            <span style={{ color: DARK.mutedLight }}>Dusk in my hometown.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 0.6 }}>
            <span style={{ fontSize: 10, fontFamily: FONT.mono, letterSpacing: '0.18em',
              color: DARK.pink, textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(244,114,182,0.4)' }}>scroll</span>
            <div style={{ width: 1, height: 40,
              background: 'linear-gradient(to bottom, ' + DARK.pink + ', ' + DARK.blue + ' 50%, transparent)',
              boxShadow: '0 0 8px rgba(244,114,182,0.4)' }}></div>
          </div>
          <div style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
            letterSpacing: '0.08em', textAlign: 'right', lineHeight: 1.7 }}>
            <span style={{ color: DARK.blue, textShadow: '0 0 12px rgba(56,189,248,0.4)' }}>issue №01</span><br />
            <span style={{ color: DARK.mutedLight }}>2026 · spring</span>
          </div>
        </div>
      </div>

      {/* ============ CURRENTLY STATUS BLOCK ============ */}
      <div style={{ position: 'relative', padding: '80px ' + pad + 'px 64px' }}>
        {/* Atmospheric glow */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(800px 400px at 50% 0%, rgba(244,114,182,0.04), transparent 60%)` }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
            <SectionLabel color={DARK.green}>※ Currently</SectionLabel>
            <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>
              status board · refreshed daily
            </span>
          </div>
          <span style={{ fontSize: 12, color: DARK.blue, fontFamily: FONT.mono }}>open work log →</span>
        </div>

        <div style={{ position: 'relative', display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 }}>

          {/* Resume here panel */}
          <div style={{ padding: '24px 28px', borderRadius: 12,
            border: '1px solid rgba(52,211,153,0.15)',
            background: 'linear-gradient(135deg, rgba(52,211,153,0.04), rgba(52,211,153,0.01))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <SectionLabel color={DARK.green} style={{ fontSize: 10 }}>Resume Here</SectionLabel>
              <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>2026-05-09 00:47 JST</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 14, lineHeight: 1.4 }}>
              Submit K.I.C.S. paper, then back to Experiment 2.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13,
              color: DARK.mutedLight, lineHeight: 1.5 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: DARK.green, fontFamily: FONT.mono, flexShrink: 0 }}>01</span>
                <span>CCT-LSTM paper reproduction → stress level classification (low/med/high).</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ color: DARK.green, fontFamily: FONT.mono, flexShrink: 0 }}>02</span>
                <span>Review 2 past exam question sets · LLM/VLM project planning.</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4, paddingTop: 12,
                borderTop: '1px dashed rgba(255,255,255,0.06)' }}>
                <span style={{ color: DARK.pink, fontFamily: FONT.mono, flexShrink: 0 }}>⚠</span>
                <span style={{ color: DARK.muted }}>Do not forget: leetcode/acm practice.</span>
              </div>
            </div>
          </div>

          {/* Current project */}
          <div style={{ padding: '24px 28px', borderRadius: 12,
            border: '1px solid ' + DARK.border, background: DARK.surface }}>
            <SectionLabel color={DARK.blue} style={{ fontSize: 10, marginBottom: 16 }}>Active Project</SectionLabel>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>K.I.C.S.</div>
            <div style={{ fontSize: 12, color: DARK.muted, marginBottom: 20, fontFamily: FONT.mono }}>paper writing</div>
            {/* Progress */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11,
                color: DARK.mutedLight, fontFamily: FONT.mono, marginBottom: 6 }}>
                <span>progress</span><span>82%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '82%',
                  background: 'linear-gradient(90deg, ' + DARK.blue + ', ' + DARK.pink + ')' }}></div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: DARK.muted, marginTop: 16 }}>
              <div>↳ next: submit & review</div>
              <div>↳ risk: deadline close</div>
            </div>
          </div>

          {/* Reading / listening */}
          <div style={{ padding: '24px 28px', borderRadius: 12,
            border: '1px solid ' + DARK.border, background: DARK.surface }}>
            <SectionLabel color={DARK.purple} style={{ fontSize: 10, marginBottom: 16 }}>Now Reading</SectionLabel>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.4 }}>
              Vision Transformers for Affective Computing
            </div>
            <div style={{ fontSize: 12, color: DARK.muted, marginBottom: 18, fontFamily: FONT.mono }}>
              arxiv · 2024
            </div>
            <div style={{ paddingTop: 16, borderTop: '1px dashed rgba(255,255,255,0.06)' }}>
              <SectionLabel color={DARK.amber} style={{ fontSize: 10, marginBottom: 8 }}>Listening</SectionLabel>
              <div style={{ fontSize: 13, color: DARK.mutedLight, lineHeight: 1.5 }}>
                Ryuichi Sakamoto — async
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ LATEST WRITING ============ */}
      <div style={{ padding: '0 ' + pad + 'px' }}>
        <div style={{ height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(244,114,182,0.18) 30%, rgba(56,189,248,0.18) 70%, transparent)' }}></div>
      </div>

      <div style={{ position: 'relative', padding: '64px ' + pad + 'px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 36 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
              Latest Writing
            </h2>
            <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>
              4 pieces · 2 languages
            </span>
          </div>
          <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>view archive →</span>
        </div>

        {/* Featured post — magazine spread */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 0,
          borderRadius: 14, overflow: 'hidden', marginBottom: 32,
          border: '1px solid rgba(244,114,182,0.12)',
          background: DARK.surface }}>
          {/* Image side */}
          <div style={{ position: 'relative', minHeight: 380 }}>
            <img src={POSTS[0].img} style={{ width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.85) saturate(0.9)' }} />
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent 50%, ' + DARK.surface + ' 100%)' }}></div>
            <div style={{ position: 'absolute', top: 20, left: 20,
              padding: '5px 12px', borderRadius: 999, fontSize: 11, fontFamily: FONT.mono,
              color: DARK.pink, background: 'rgba(7,8,9,0.6)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(244,114,182,0.3)' }}>
              ★ Pinned · Essay
            </div>
          </div>
          {/* Content side */}
          <div style={{ padding: '40px 40px 36px', display: 'flex', flexDirection: 'column',
            justifyContent: 'center' }}>
            <SectionLabel style={{ marginBottom: 16 }}>Essay № 01</SectionLabel>
            <h3 style={{ fontSize: 32, fontWeight: 700, margin: 0, lineHeight: 1.2,
              letterSpacing: '-0.01em' }}>
              {POSTS[0].title}
            </h3>
            <p style={{ fontSize: 14, color: DARK.mutedLight, lineHeight: 1.8, margin: '16px 0 24px' }}>
              {POSTS[0].desc}
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>{POSTS[0].date}</span>
              <span style={{ color: DARK.border }}>·</span>
              <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>8 min read</span>
              <span style={{ color: DARK.border }}>·</span>
              <span style={{ fontSize: 12, color: DARK.blue, fontFamily: FONT.mono }}>中文 available</span>
            </div>
          </div>
        </div>

        {/* Remaining posts: 3 column with images */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {POSTS.slice(1).map((post, i) => (
            <div key={i} style={{ borderRadius: 10, overflow: 'hidden',
              border: '1px solid ' + DARK.border, background: DARK.surface }}>
              <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
                <img src={post.img} style={{ width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'brightness(0.85) saturate(0.9)' }} />
                <div style={{ position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, ' + DARK.surface + ' 0%, transparent 35%)' }}></div>
                <div style={{ position: 'absolute', bottom: 12, left: 16,
                  fontSize: 10, color: DARK.mutedLight, fontFamily: FONT.mono,
                  letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  № 0{i + 2}
                </div>
              </div>
              <div style={{ padding: '20px 22px 24px' }}>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>{post.title}</div>
                <div style={{ fontSize: 13, color: DARK.muted, lineHeight: 1.6, marginBottom: 16,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.desc}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>{post.date}</span>
                  {post.tags.map((t, j) => (
                    <span key={j} style={{ fontSize: 10, color: DARK.mutedLight, fontFamily: FONT.mono,
                      padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.04)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ LITERARY QUOTE — Baudelaire ============ */}
      <div style={{ position: 'relative', padding: '80px ' + pad + 'px', overflow: 'hidden' }}>
        {/* Subtle backdrop */}
        <div style={{ position: 'absolute', inset: 0,
          background: `radial-gradient(700px 300px at 50% 50%, rgba(244,114,182,0.04), transparent 65%)` }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          {/* Decorative line */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, gap: 12, alignItems: 'center' }}>
            <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.15)' }}></div>
            <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
              letterSpacing: '0.2em', textTransform: 'uppercase' }}>Marginalia</span>
            <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.15)' }}></div>
          </div>

          <p style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontStyle: 'italic',
            lineHeight: 1.7, color: '#e8eaed', margin: 0, fontWeight: 300 }}>
            « Qui aimes-tu le mieux, homme énigmatique, dis ? »<br />
            <span style={{ color: DARK.mutedLight }}>
              — J'aime les nuages… les nuages qui passent… là-bas…<br />
              là-bas… les merveilleux nuages !
            </span>
          </p>

          <div style={{ marginTop: 28, fontSize: 12, color: DARK.muted, fontFamily: FONT.mono,
            letterSpacing: '0.04em' }}>
            — Charles Baudelaire, <em style={{ color: DARK.mutedLight }}>L'Étranger</em>, 1869
          </div>
        </div>
      </div>

      {/* ============ FOOTER ============ */}
      <div style={{ padding: '0 ' + pad + 'px' }}>
        <div style={{ height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 50%, transparent)' }}></div>
      </div>

      <div style={{ padding: '40px ' + pad + 'px 60px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', fontFamily: FONT.mono, fontSize: 12 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ color: DARK.muted }}>© 2026 EnderJones</span>
          <span style={{ color: DARK.border }}>·</span>
          <span style={{ color: DARK.muted }}>Built with care in Tokyo</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['github','twitter','email','rss'].map((s, i) => (
            <span key={i} style={{ color: DARK.mutedLight, fontSize: 12 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Light palette */}
      <div style={{ padding: '0 ' + pad + 'px 40px' }}>
        <LightPalette
          colors={['#faf8f4','#ffffff','#c2185b','#0277bd','#7b1fa2','#1a1a1a']}
          labels={['paper','white','pink','blue','accent','ink']}
        />
      </div>

      {/* Direction label */}
      <div style={{ position: 'absolute', top: 28, left: pad - 28, display: 'flex', gap: 8,
        alignItems: 'center', zIndex: 20 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: DARK.pink,
          boxShadow: '0 0 8px ' + DARK.pink }}></div>
        <span style={{ fontSize: 10, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Direction D — Editorial (recommended)
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { Editorial });
