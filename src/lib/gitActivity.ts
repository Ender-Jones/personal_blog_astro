import { execFileSync } from 'node:child_process';

export type GitActivityDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type GitActivitySnapshot = {
  days: GitActivityDay[];
  source: 'git' | 'unavailable';
  totalCommits: number;
};

export function getGitActivityDays(weeks = 12, now = new Date()): GitActivityDay[] {
  return getGitActivitySnapshot(weeks, now).days;
}

export function getGitActivitySnapshot(weeks = 12, now = new Date()): GitActivitySnapshot {
  const dayCount = weeks * 7;
  const start = new Date(now);
  start.setDate(now.getDate() - dayCount + 1);
  start.setHours(0, 0, 0, 0);

  const { counts, source } = readGitCommitCounts(start);
  let totalCommits = 0;

  const days = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = formatDateKey(date);
    const count = counts.get(key) ?? 0;
    totalCommits += count;

    return {
      date: key,
      count,
      level: getCommitLevel(count),
    };
  });

  return { days, source, totalCommits };
}

function readGitCommitCounts(start: Date) {
  const counts = new Map<string, number>();

  try {
    const output = execFileSync(
      'git',
      ['log', `--since=${formatDateKey(start)}`, '--date=format:%Y-%m-%d', '--format=%ad'],
      { encoding: 'utf8' },
    );

    for (const date of output.split('\n').filter(Boolean)) {
      counts.set(date, (counts.get(date) ?? 0) + 1);
    }

    return { counts, source: 'git' as const };
  } catch {
    // Build environments without git history should render an empty, non-live wall.
    return { counts, source: 'unavailable' as const };
  }
}

function getCommitLevel(count: number): GitActivityDay['level'] {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 7) return 3;
  return 4;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
