import { getCollection } from 'astro:content';
import { byDateDesc, getTagCounts, tagSlug } from '../lib/content';
import { site } from '../lib/data';

type SitemapEntry = {
  path: string;
  lastmod?: Date;
  priority?: string;
};

export async function GET() {
  const posts = byDateDesc(await getCollection('posts'));
  const worklogs = byDateDesc(await getCollection('worklogs'));
  const tags = getTagCounts(posts);
  const latestPost = posts[0]?.data.date;
  const latestWorklog = worklogs[0]?.data.updated ?? worklogs[0]?.data.date;

  const entries: SitemapEntry[] = [
    { path: '/', lastmod: latestPost ?? latestWorklog, priority: '1.0' },
    { path: '/posts/', lastmod: latestPost, priority: '0.8' },
    { path: '/tags/', lastmod: latestPost, priority: '0.5' },
    { path: '/worklog/', lastmod: latestWorklog, priority: '0.5' },
    { path: '/about/', priority: '0.6' },
    ...posts.map((post) => ({
      path: `/posts/${post.id}/`,
      lastmod: post.data.date,
      priority: post.data.pinned ? '0.8' : '0.7',
    })),
    ...tags.map(([tag]) => ({
      path: `/tags/${tagSlug(tag)}/`,
      lastmod: latestPost,
      priority: '0.4',
    })),
    ...worklogs.map((worklog) => ({
      path: `/worklog/${worklog.id}/`,
      lastmod: worklog.data.updated ?? worklog.data.date,
      priority: '0.3',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(renderUrl)
    .join('\n')}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

function renderUrl(entry: SitemapEntry) {
  const loc = escapeXml(new URL(entry.path, site.url).toString());
  const lastmod = entry.lastmod ? `<lastmod>${entry.lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
  const priority = entry.priority ? `<priority>${entry.priority}</priority>` : '';

  return `  <url><loc>${loc}</loc>${lastmod}${priority}</url>`;
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
