// ============================================
// ARCHIVE PAGE — /posts/
// Adapts to post count:
//   • n ≤ 3        → magazine layout, no search bar
//   • 4 ≤ n ≤ 12   → cards + collapsed search, pinned hero
//   • n > 12       → full search + filter + view toggle
//
// Only one pinned post gets the magazine hero treatment.
// ============================================

function ArchivePage() {
  const pad = 80;

  // Realistic small archive — 6 posts total
  const allPosts = [
    ...POSTS,
    { title: 'Notes on EDA Signal Augmentation for Stress',
      date: '2026.03.18', tags: ['research','EDA'],
      desc: 'Lessons from trying random crop, mixup, and time-warp on EDA windows.',
      img: POST_IMAGES.regression },
    { title: 'Reading: Vision Transformers for Affect Recognition',
      date: '2026.02.05', tags: ['paper-notes','vision'],
      desc: 'A weekly digest of three papers on ViT for affective computing.',
      img: POST_IMAGES.ai },
  ];
  const total = allPosts.length;

  // Adaptive controls — at n=6 we're in "few posts" mode
  const showFullSearch = total > 12;
  const showCollapsedSearch = total >= 4 && total <= 12;
  const showNoSearch = total <= 3;

  return (
    <div style={{ width: 1440, minHeight: 1700, background: '#070809', fontFamily: FONT.sans,
      color: DARK.text, position: 'relative', overflow: 'hidden' }}>

      {/* Atmospheric grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.018) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.018) 1px, transparent 1px),
          radial-gradient(800px 500px at 80% 15%, rgba(56,189,248,0.035), transparent 60%)`,
        backgroundSize: '40px 40px, 40px 40px, 100% 100%' }} />

      {/* Nav */}
      <nav style={{ position: 'relative', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '0 ' + pad + 'px', height: 64,
        borderBottom: '1px solid ' + DARK.border }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 700, letterSpacing: '0.02em' }}>
          EnderJones<BlinkCursor color={DARK.pink} />
        </span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {['Posts','Tags','Worklog','About'].map((item, i) => (
            <span key={i} style={{ fontSize: 12, fontFamily: FONT.mono, letterSpacing: '0.02em',
              color: item === 'Posts' ? DARK.pink : DARK.mutedLight,
              borderBottom: item === 'Posts' ? '1px solid ' + DARK.pink : 'none', paddingBottom: 2 }}>
              {item}
            </span>
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

      {/* Two-column body: AuthorRail (left) + main archive (right) */}
      <div style={{ position: 'relative', padding: '64px ' + pad + 'px 0',
        display: 'grid', gridTemplateColumns: '200px 1fr', gap: 56,
        alignItems: 'flex-start' }}>

        <AuthorRail />

        <div style={{ minWidth: 0 }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <SectionLabel color={DARK.pink} style={{ marginBottom: 12 }}>/ posts</SectionLabel>
            <h1 style={{ fontSize: 52, fontWeight: 800, margin: 0, lineHeight: 1,
              letterSpacing: '-0.02em', color: '#fff' }}>
              All Writing
            </h1>
            <p style={{ fontSize: 15, color: DARK.mutedLight, margin: '14px 0 0' }}>
              {total} posts · {showNoSearch
                ? 'a small archive — read top to bottom.'
                : showCollapsedSearch
                  ? 'browse by year or filter by tag.'
                  : 'search and filter by tag, year, or language.'}
            </p>
          </div>

          {/* Filter bar — adaptive */}
          <div style={{ paddingBottom: 32 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Compact tag chips — always visible, only tags with posts */}
          <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(244,114,182,0.1)',
            border: '1px solid rgba(244,114,182,0.25)', color: DARK.pink }}>
            all <span style={{ opacity: 0.6 }}>{total}</span>
          </span>
          {[['AI', 2],['research', 2],['blogging', 1],['paper-notes', 1],
            ['poem', 1],['memory', 1]].map(([t, c], i) => (
            <span key={i} style={{ fontSize: 11, color: DARK.mutedLight, fontFamily: FONT.mono,
              padding: '5px 12px', borderRadius: 999,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.05)' }}>
              #{t} <span style={{ color: DARK.muted, opacity: 0.7 }}>{c}</span>
            </span>
          ))}

          <div style={{ flex: 1 }}></div>

          {/* Collapsed search — small icon button */}
          {showCollapsedSearch && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center',
              padding: '8px 12px', borderRadius: 8, background: DARK.surface,
              border: '1px solid ' + DARK.border, cursor: 'pointer' }}>
              <span style={{ fontSize: 13, color: DARK.muted }}>⌕</span>
              <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
                padding: '2px 6px', borderRadius: 3, background: 'rgba(255,255,255,0.04)' }}>⌘ K</span>
            </div>
          )}

          {/* View toggle — defaults to list at n ≤ 6 */}
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden',
            border: '1px solid ' + DARK.border }}>
            <span style={{ padding: '8px 12px', fontSize: 11, color: DARK.muted, fontFamily: FONT.mono,
              background: DARK.surface, borderRight: '1px solid ' + DARK.border }}>▦ Cards</span>
            <span style={{ padding: '8px 12px', fontSize: 11, color: '#fff', fontFamily: FONT.mono,
              background: 'rgba(244,114,182,0.08)' }}>≡ List</span>
          </div>
        </div>

        <div style={{ marginTop: 12, fontSize: 10, color: DARK.muted, fontFamily: FONT.mono,
          display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ opacity: 0.7 }}>↳ adaptive layout:</span>
          <span style={{ color: showCollapsedSearch ? DARK.pink : DARK.muted }}>
            n = {total} → collapsed-search mode (4-12 posts)
          </span>
          <span style={{ opacity: 0.5 }}>· full search re-enables at n &gt; 12</span>
        </div>
      </div>

      {/* Year section: 2026 */}
      <div style={{ paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 200, color: DARK.muted,
            letterSpacing: '-0.02em' }}>2026</span>
          <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>3 posts</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)', marginLeft: 12 }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {allPosts.slice(1, 4).map((post, i) => (
            <div key={i} style={{ borderRadius: 12, overflow: 'hidden',
              border: '1px solid ' + DARK.border, background: DARK.surface }}>
              {post.img && (
                <div style={{ height: 150, position: 'relative', overflow: 'hidden' }}>
                  <img src={post.img} style={{ width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'brightness(0.85) saturate(0.9)' }} />
                  <div style={{ position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, ' + DARK.surface + ' 0%, transparent 35%)' }}></div>
                </div>
              )}
              <div style={{ padding: '18px 20px 20px' }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, lineHeight: 1.35,
                  color: '#fff' }}>
                  {post.title}
                </div>
                <div style={{ fontSize: 12, color: DARK.muted, lineHeight: 1.6, marginBottom: 14,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.desc}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: DARK.muted, fontFamily: FONT.mono }}>{post.date}</span>
                  {post.tags.map((t, j) => (
                    <span key={j} style={{ fontSize: 9, color: DARK.mutedLight, fontFamily: FONT.mono,
                      padding: '2px 7px', borderRadius: 4,
                      background: 'rgba(255,255,255,0.04)' }}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year section: 2025 */}
      <div style={{ paddingTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 44, fontWeight: 200, color: DARK.muted,
            letterSpacing: '-0.02em' }}>2025</span>
          <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>3 posts</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)', marginLeft: 12 }}></div>
        </div>

        {/* Single pinned post — magazine treatment */}
        <div style={{ borderRadius: 12, overflow: 'hidden', display: 'grid',
          gridTemplateColumns: '1.3fr 1fr', marginBottom: 18,
          border: '1px solid rgba(244,114,182,0.14)', background: DARK.surface }}>
          <div style={{ position: 'relative', minHeight: 240 }}>
            <img src={POSTS[0].img} style={{ width: '100%', height: '100%', objectFit: 'cover',
              filter: 'brightness(0.82) saturate(0.9)' }} />
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, transparent 50%, ' + DARK.surface + ' 100%)' }}></div>
            <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 11px',
              borderRadius: 999, fontSize: 11, fontFamily: FONT.mono, color: DARK.pink,
              background: 'rgba(7,8,9,0.6)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(244,114,182,0.3)' }}>★ Pinned</div>
          </div>
          <div style={{ padding: '30px 32px', display: 'flex', flexDirection: 'column',
            justifyContent: 'center' }}>
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px', lineHeight: 1.3,
              color: '#fff' }}>
              {POSTS[0].title}
            </h3>
            <p style={{ fontSize: 13, color: DARK.mutedLight, lineHeight: 1.7, margin: '0 0 18px' }}>
              {POSTS[0].desc}
            </p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: DARK.muted, fontFamily: FONT.mono }}>{POSTS[0].date}</span>
              <span style={{ fontSize: 11, color: DARK.blue, fontFamily: FONT.mono }}>中文 available</span>
              {POSTS[0].tags.map((t, j) => (
                <span key={j} style={{ fontSize: 10, color: DARK.mutedLight, fontFamily: FONT.mono,
                  padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.04)' }}>#{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Compact list for other 2025 posts */}
        <div style={{ borderRadius: 12, overflow: 'hidden',
          border: '1px solid ' + DARK.border, background: DARK.surface }}>
          {[POSTS[2], POSTS[3]].map((post, i) => (
            <div key={i} style={{ display: 'grid',
              gridTemplateColumns: '110px 80px 1fr auto', gap: 20, alignItems: 'center',
              padding: '16px 22px',
              borderBottom: i === 0 ? '1px solid ' + DARK.border : 'none' }}>
              <span style={{ fontSize: 12, color: DARK.muted, fontFamily: FONT.mono }}>{post.date}</span>
              <div style={{ width: 64, height: 48, borderRadius: 6, overflow: 'hidden' }}>
                <img src={post.img} style={{ width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'brightness(0.85)' }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: '#fff' }}>
                  {post.title}</div>
                <div style={{ fontSize: 12, color: DARK.muted, lineHeight: 1.5,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 520 }}>
                  {post.desc}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {post.tags.map((t, j) => (
                  <span key={j} style={{ fontSize: 10, color: DARK.mutedLight, fontFamily: FONT.mono,
                    padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.04)' }}>#{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '60px ' + pad + 'px 48px' }}>
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

      {/* Direction label */}
      <div style={{ position: 'absolute', top: 24, left: pad - 30, display: 'flex', gap: 8,
        alignItems: 'center', zIndex: 20 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: DARK.amber,
          boxShadow: '0 0 8px ' + DARK.amber }}></div>
        <span style={{ fontSize: 10, fontFamily: FONT.mono, color: DARK.mutedLight,
          letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Archive · /posts/ · adaptive
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { ArchivePage });
