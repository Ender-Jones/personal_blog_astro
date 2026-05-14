import type { CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;
export type WorklogEntry = CollectionEntry<'worklogs'>;

export function byDateDesc<T extends { data: { date: Date } }>(items: T[]) {
  return [...items].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
  }).format(date);
}

export function postHref(post: PostEntry) {
  return `/posts/${post.id}/`;
}

export function worklogHref(worklog: WorklogEntry) {
  return `/worklog/${worklog.id}/`;
}

export function getTagCounts(posts: PostEntry[]) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
