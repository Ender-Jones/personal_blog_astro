import { byDateDesc, type WorklogEntry } from './content';

export type CurrentThread =
  | {
      state: 'normal' | 'stale';
      worklog: WorklogEntry;
      summary: string;
      bullets: string[];
      updatedAt: Date;
      source: 'frontmatter' | 'block';
    }
  | {
      state: 'collapsed';
      worklog?: WorklogEntry;
      updatedAt?: Date;
      reason: 'no-worklog' | 'no-public-block' | 'too-old';
    };

const PUBLIC_THREAD_RE = /<!-- public:thread:start -->([\s\S]*?)<!-- public:thread:end -->/;

export function getCurrentThread(worklogs: WorklogEntry[], now = new Date()): CurrentThread {
  const latest = byDateDesc(worklogs)[0];

  if (!latest) {
    return { state: 'collapsed', reason: 'no-worklog' };
  }

  const updatedAt = latest.data.updated ?? latest.data.date;

  if (latest.data.public_thread) {
    const state = getStalenessState(updatedAt, now);

    if (state === 'collapsed') {
      return { state, reason: 'too-old', worklog: latest, updatedAt };
    }

    return {
      state,
      worklog: latest,
      updatedAt,
      source: 'frontmatter',
      summary: latest.data.public_thread.summary,
      bullets: latest.data.public_thread.bullets,
    };
  }

  const match = latest.body?.match(PUBLIC_THREAD_RE);

  if (!match) {
    return {
      state: 'collapsed',
      reason: 'no-public-block',
      worklog: latest,
      updatedAt,
    };
  }

  const parsed = parsePublicBlock(match[1]);
  const state = getStalenessState(updatedAt, now);

  if (state === 'collapsed') {
    return { state, reason: 'too-old', worklog: latest, updatedAt };
  }

  return {
    state,
    worklog: latest,
    updatedAt,
    source: 'block',
    summary: parsed.summary,
    bullets: parsed.bullets,
  };
}

function parsePublicBlock(block: string) {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const bullets = lines
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, ''))
    .slice(0, 4);

  const summary = lines.find((line) => !/^[-*]\s+/.test(line)) ?? bullets[0] ?? 'Work in progress.';

  return { summary, bullets };
}

function getStalenessState(date: Date, now: Date): 'normal' | 'stale' | 'collapsed' {
  const days = Math.floor((now.getTime() - date.getTime()) / 86400000);

  if (days <= 14) return 'normal';
  if (days <= 45) return 'stale';
  return 'collapsed';
}
