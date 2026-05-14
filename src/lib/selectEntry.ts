import type { PostEntry } from './content';

export type SelectedEntryVariant =
  | 'selected'
  | 'pinned'
  | 'startHere'
  | 'latest'
  | 'research';

export type SelectedEntryResult = {
  entry: PostEntry | null;
  variant: SelectedEntryVariant;
};

export function getIsoWeek(date = new Date()) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = target.getUTCDay() || 7;

  target.setUTCDate(target.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const diffDays = Math.floor((target.getTime() - yearStart.getTime()) / 86400000) + 1;

  return Math.ceil(diffDays / 7);
}

export function resolveSelectedEntry(posts: PostEntry[], weekOfYear = getIsoWeek()): SelectedEntryResult {
  const selectedPool = posts.filter((post) => post.data.selected);

  if (selectedPool.length > 0) {
    return {
      entry: rotate(selectedPool, weekOfYear),
      variant: 'selected',
    };
  }

  const pinnedPool = posts.filter((post) => post.data.pinned);

  if (pinnedPool.length > 0) {
    return {
      entry: rotate(pinnedPool, weekOfYear),
      variant: 'pinned',
    };
  }

  const whoAmI = posts.find((post) => post.id === 'who-am-i');

  if (whoAmI) {
    return {
      entry: whoAmI,
      variant: 'startHere',
    };
  }

  const latest = [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime())[0];

  if (latest) {
    return {
      entry: latest,
      variant: 'latest',
    };
  }

  return {
    entry: null,
    variant: 'research',
  };
}

function rotate(posts: PostEntry[], weekOfYear: number) {
  const sorted = [...posts].sort((a, b) => a.id.localeCompare(b.id));
  return sorted[weekOfYear % sorted.length];
}
