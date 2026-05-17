import { site } from '../lib/data';

export function GET() {
  const sitemapUrl = new URL('/sitemap.xml', site.url).toString();

  return new Response(`User-agent: *\nDisallow: /norobots/\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
