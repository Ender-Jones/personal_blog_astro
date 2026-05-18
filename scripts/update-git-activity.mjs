import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const root = process.cwd();
const weeks = 12;
const now = new Date();
const { start, dayCount } = getAlignedWindow(weeks, now);
const counts = readGitCommitCounts(start);

const days = Array.from({ length: dayCount }, (_, index) => {
  const date = new Date(start);
  date.setDate(start.getDate() + index);
  const key = formatDateKey(date);

  return {
    date: key,
    count: counts.get(key) ?? 0,
  };
});

const snapshot = {
  generatedAt: now.toISOString(),
  weeks,
  source: 'git log',
  days,
};

writeFileSync(join(root, 'src/data/git-activity.json'), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Updated src/data/git-activity.json with ${days.length} days.`);

function readGitCommitCounts(start) {
  const counts = new Map();
  const output = execFileSync(
    'git',
    ['log', `--since=${formatDateKey(start)}`, '--date=format:%Y-%m-%d', '--format=%ad'],
    { encoding: 'utf8' },
  );

  for (const date of output.split('\n').filter(Boolean)) {
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  return counts;
}

function getAlignedWindow(weeks, now) {
  const dayCount = weeks * 7;
  const end = new Date(now);
  end.setDate(now.getDate() + (6 - now.getDay()));
  end.setHours(0, 0, 0, 0);

  const start = new Date(end);
  start.setDate(end.getDate() - dayCount + 1);

  return { start, dayCount };
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
