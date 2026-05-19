import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';
import {
  commentsEnabled,
  hasConfiguredGiscus,
  listFiles,
  listMarkdownFiles,
  readFrontmatter,
  readFrontmatterList,
  readFrontmatterValue,
  readIfExists,
  readYamlScalar,
  routeToFile,
  stripExtension,
  tagSlug,
} from './lib/content-utils.mjs';

const root = process.cwd();
const distDir = join(root, 'dist');
const contentDir = join(root, 'src/content');
const siteConfigPath = join(root, 'src/data/site.yml');
const siteConfig = readFileSync(siteConfigPath, 'utf8');
const siteUrl = readYamlScalar(siteConfig, 'url');
const giscusConfigured = hasConfiguredGiscus(siteConfig);
const errors = [];
const postIds = [];
const worklogIds = [];
const tagIds = new Set();
let hasMarginaliaSource = false;
let hasCommentEnabledPost = false;

collectContentRoutes();
verifyRequiredDistFiles();
verifyDeploymentFiles();
verifyGeneratedRoutes();
verifySitemap();
verifyRobots();
verifyNoRuntimeApis();
verifyGiscusOutput();
verifyHomepageMarginalia();

if (errors.length > 0) {
  console.error('Build verification failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Build verification passed.');

function collectContentRoutes() {
  for (const file of listMarkdownFiles(join(contentDir, 'posts'))) {
    const frontmatter = readFrontmatter(readFileSync(file, 'utf8'));
    postIds.push(stripExtension(relative(join(contentDir, 'posts'), file)));
    if (commentsEnabled(frontmatter)) hasCommentEnabledPost = true;

    for (const tag of readFrontmatterList(frontmatter, 'tags')) {
      tagIds.add(tagSlug(tag));
    }

    if (hasEligibleMarginalia(frontmatter)) {
      hasMarginaliaSource = true;
    }
  }

  for (const file of listMarkdownFiles(join(contentDir, 'worklogs'))) {
    worklogIds.push(stripExtension(relative(join(contentDir, 'worklogs'), file)));
  }
}

function verifyRequiredDistFiles() {
  for (const file of [
    'index.html',
    '404.html',
    '_headers',
    'robots.txt',
    'sitemap.xml',
    'googleea7f91fa26471a51.html',
  ]) {
    verifyExists(join(distDir, file), `dist/${file}`);
  }
}

function verifyDeploymentFiles() {
  if (!siteUrl) {
    errors.push('src/data/site.yml: missing url.');
    return;
  }

  try {
    new URL(siteUrl);
  } catch {
    errors.push(`src/data/site.yml: invalid url "${siteUrl}".`);
    return;
  }

  const headers = readIfExists(join(distDir, '_headers')) ?? '';
  for (const header of ['X-Content-Type-Options', 'Referrer-Policy', 'Permissions-Policy']) {
    if (!headers.includes(header)) {
      errors.push(`dist/_headers: missing ${header}.`);
    }
  }

  const verification = readIfExists(join(distDir, 'googleea7f91fa26471a51.html')) ?? '';
  if (!verification.includes('google-site-verification')) {
    errors.push('dist/googleea7f91fa26471a51.html: missing Google verification token.');
  }
}

function verifyGeneratedRoutes() {
  const routes = [
    '/',
    '/about/',
    '/posts/',
    '/tags/',
    '/worklog/',
    ...postIds.map((id) => `/posts/${id}/`),
    ...worklogIds.map((id) => `/worklog/${id}/`),
    ...[...tagIds].map((id) => `/tags/${id}/`),
  ];

  for (const route of routes) {
    verifyExists(join(distDir, routeToFile(route)), `dist${routeToFile(route)}`);
  }
}

function verifySitemap() {
  const sitemap = readIfExists(join(distDir, 'sitemap.xml')) ?? '';

  for (const path of ['/', '/about/', '/posts/', '/tags/', '/worklog/']) {
    const loc = new URL(path, siteUrl).toString();
    if (!sitemap.includes(`<loc>${escapeXml(loc)}</loc>`)) {
      errors.push(`dist/sitemap.xml: missing ${loc}.`);
    }
  }

  for (const id of postIds) {
    const loc = new URL(`/posts/${id}/`, siteUrl).toString();
    if (!sitemap.includes(`<loc>${escapeXml(loc)}</loc>`)) {
      errors.push(`dist/sitemap.xml: missing ${loc}.`);
    }
  }
}

function verifyRobots() {
  const robots = readIfExists(join(distDir, 'robots.txt')) ?? '';
  const sitemapUrl = new URL('/sitemap.xml', siteUrl).toString();

  if (!robots.includes('User-agent: *')) {
    errors.push('dist/robots.txt: missing User-agent rule.');
  }

  if (!robots.includes(`Sitemap: ${sitemapUrl}`)) {
    errors.push(`dist/robots.txt: missing sitemap URL ${sitemapUrl}.`);
  }
}

function verifyNoRuntimeApis() {
  for (const file of listFiles(distDir)) {
    if (!/\.(html|js)$/i.test(file)) continue;

    const source = readFileSync(file, 'utf8');
    if (/\bfetch\s*\(|\bXMLHttpRequest\b|\baxios\b/.test(source)) {
      errors.push(`${relative(root, file)}: runtime API call found in built output.`);
    }

    if (/\{:\s*[^}]+}/.test(source)) {
      errors.push(`${relative(root, file)}: unrendered Kramdown attribute-list leaked into built output.`);
    }
  }
}

function verifyGiscusOutput() {
  const scriptFound = listFiles(distDir).some((file) => {
    if (!/\.html$/i.test(file)) return false;
    return readFileSync(file, 'utf8').includes('giscus.app/client.js');
  });

  if (scriptFound && !giscusConfigured) {
    errors.push('dist: Giscus script rendered without real site.comments.giscus config.');
  }

  if (hasCommentEnabledPost && !scriptFound) {
    errors.push('dist: Giscus script missing despite enabled post comments.');
  }
}

function verifyHomepageMarginalia() {
  const homepage = readIfExists(join(distDir, 'index.html')) ?? '';

  if (hasMarginaliaSource && !homepage.includes('class="marginalia"')) {
    errors.push('dist/index.html: missing Marginalia section despite eligible post marginalia.');
  }

  if (hasMarginaliaSource && !homepage.includes('--marginalia-image: url(&quot;/')) {
    errors.push('dist/index.html: Marginalia image CSS variable is missing or not root-relative.');
  }

  if (homepage.includes('Everything that comes from weakness.</blockquote>')) {
    errors.push('dist/index.html: old standalone quote data leaked into Homepage Marginalia.');
  }
}

function verifyExists(file, label) {
  if (!existsSync(file)) errors.push(`${label}: missing.`);
}

function hasEligibleMarginalia(frontmatter) {
  if (!/^marginalia:/m.test(frontmatter)) return false;
  if (readFrontmatterValue(frontmatter, 'marginalia') === 'false') return false;
  return Boolean(readFrontmatterValue(frontmatter, 'image'));
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
