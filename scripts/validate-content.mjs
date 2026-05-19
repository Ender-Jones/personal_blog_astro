import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import process from 'node:process';
import {
  commentsEnabled,
  hasConfiguredGiscus,
  hasFileExtension,
  hasNestedFrontmatterKey,
  listMarkdownFiles,
  listProjectSourceFiles,
  readFrontmatter,
  readFrontmatterList,
  readFrontmatterValue,
  readNestedFrontmatterValue,
  readYamlScalar,
  stripExtension,
  tagSlug,
} from './lib/content-utils.mjs';

const root = process.cwd();
const contentDir = join(root, 'src/content');
const publicDir = join(root, 'public');
const siteConfigPath = join(root, 'src/data/site.yml');
const tagsConfigPath = join(root, 'src/data/tags.yml');
const errors = [];
const postIds = new Set();
const worklogIds = new Set();
const tagIds = new Set();
const i18nLinks = [];
const markdownLinks = [];
const siteConfig = readFileSync(siteConfigPath, 'utf8');
const siteUrl = readYamlScalar(siteConfig, 'url');
const giscusConfigured = hasConfiguredGiscus(siteConfig);
const tagToneBySlug = readTagToneConfig(readFileSync(tagsConfigPath, 'utf8'));
const contentFiles = listMarkdownFiles(contentDir);

validateSiteConfig();
validateNoRuntimeApis();

for (const file of contentFiles) {
  const source = readFileSync(file, 'utf8');
  const frontmatter = readFrontmatter(source);
  const collection = relative(contentDir, file).split(/[\\/]/)[0];

  if (!['posts', 'worklogs'].includes(collection)) {
    fail(file, 'only posts/ and worklogs/ are allowed in src/content; move drafts outside src/content.');
  }

  if (/^draft:/m.test(frontmatter)) {
    fail(file, 'draft frontmatter is not supported; move unfinished content to drafts/.');
  }

  validateNoKramdownAttrs(file, source);

  if (/<style[\s>]/i.test(source)) {
    fail(file, 'contains a <style> tag; move content styles to src/styles/prose.css.');
  }

  if (/\sstyle\s*=/i.test(source)) {
    fail(file, 'contains inline style=; use semantic classes and prose.css instead.');
  }

  if (/^cover_mode:\s*inline\s*$/m.test(frontmatter)) {
    fail(file, 'uses unsupported cover_mode: inline.');
  }

  if (collection === 'worklogs' && /^comments:/m.test(frontmatter)) {
    fail(file, 'worklogs must not accept comments frontmatter.');
  }

  if (collection === 'posts' && commentsEnabled(frontmatter) && !giscusConfigured) {
    fail(file, 'post comments are enabled by default; set comments: false or configure site.comments.giscus.');
  }

  if (collection === 'posts') {
    postIds.add(stripExtension(relative(join(contentDir, 'posts'), file)));
    for (const tag of readFrontmatterList(frontmatter, 'tags')) tagIds.add(tagSlug(tag));

    const image = readFrontmatterValue(frontmatter, 'image');
    if (image) validatePublicPath(file, image, 'frontmatter image');
    validateMarginalia(file, frontmatter, image);

    const i18nAlt = readFrontmatterValue(frontmatter, 'i18n_alt');
    if (i18nAlt) i18nLinks.push([file, i18nAlt]);
  }

  if (collection === 'worklogs') {
    worklogIds.add(stripExtension(relative(join(contentDir, 'worklogs'), file)));
    validatePublicThreadBlock(file, source);
  }

  for (const imagePath of readMarkdownImagePaths(source)) {
    validateImagePath(file, imagePath);
  }

  for (const linkPath of readMarkdownLinkPaths(source)) {
    markdownLinks.push([file, linkPath]);
  }
}

for (const [file, target] of i18nLinks) {
  if (!postIds.has(target)) {
    fail(file, `i18n_alt points to missing post slug "${target}".`);
  }
}

const knownRoutes = getKnownRoutes();
for (const [file, target] of markdownLinks) {
  validateMarkdownLink(file, target, knownRoutes);
}

for (const tag of tagIds) {
  if (!tagToneBySlug.has(tag)) {
    errors.push(`src/data/tags.yml: missing tone metadata for tag "${tag}".`);
  }
}

if (errors.length > 0) {
  console.error('Content validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Content validation passed.');

function validateSiteConfig() {
  if (!siteUrl) {
    errors.push('src/data/site.yml: missing url.');
    return;
  }

  let siteHost;

  try {
    siteHost = new URL(siteUrl).host;
  } catch {
    errors.push(`src/data/site.yml: invalid url "${siteUrl}".`);
    return;
  }

  const astroConfig = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
  const astroSiteUrl = astroConfig.match(/site:\s*['"](.+?)['"]/)?.[1];
  if (astroSiteUrl && astroSiteUrl.replace(/\/$/, '') !== siteUrl.replace(/\/$/, '')) {
    errors.push(`astro.config.mjs: site does not match src/data/site.yml url (${siteUrl}).`);
  }

  const cnamePath = join(publicDir, 'CNAME');
  if (existsSync(cnamePath)) {
    const cname = readFileSync(cnamePath, 'utf8').trim();
    if (cname !== siteHost) {
      errors.push(`public/CNAME: "${cname}" does not match site url host "${siteHost}".`);
    }
  }
}

function validateNoRuntimeApis() {
  for (const file of listProjectSourceFiles(join(root, 'src'))) {
    const source = readFileSync(file, 'utf8');

    if (/\bfetch\s*\(|\bXMLHttpRequest\b|\baxios\b/.test(source)) {
      fail(file, 'runtime API calls are not allowed in src/. Use build-time data instead.');
    }
  }
}

function readTagToneConfig(source) {
  const entries = new Map();
  const tagBlockPattern = /^([a-z0-9-]+):\s*\r?\n((?:\s{2,}.+\r?\n?)+)/gm;

  for (const match of source.matchAll(tagBlockPattern)) {
    const slug = match[1];
    const tone = match[2].match(/^\s+tone:\s*(research|personal|neutral)\s*$/m)?.[1];
    if (tone) entries.set(slug, tone);
  }

  return entries;
}

function readMarkdownImagePaths(source) {
  const paths = [];
  const imagePattern = /!\[[^\]]*]\(([^)]+)\)/g;

  for (const match of source.matchAll(imagePattern)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, '');
    const path = rawTarget.split(/\s+/)[0];

    if (path) paths.push(path);
  }

  return paths;
}

function readMarkdownLinkPaths(source) {
  const paths = [];
  const linkPattern = /(?<!!)\[[^\]\n]+]\(([^)\n]+)\)/g;

  for (const match of source.matchAll(linkPattern)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, '');
    const path = rawTarget.split(/\s+/)[0];

    if (path) paths.push(path);
  }

  return paths;
}

function validateImagePath(file, imagePath) {
  if (/^(https?:)?\/\//.test(imagePath)) return;
  if (imagePath.startsWith('#')) return;

  if (imagePath.startsWith('/')) {
    validatePublicPath(file, imagePath, 'markdown image');
    return;
  }

  const absolutePath = resolve(dirname(file), imagePath);
  if (!existsSync(absolutePath)) {
    fail(file, `markdown image path does not exist: ${imagePath}`);
  }
}

function validateMarkdownLink(file, linkPath, knownRoutes) {
  if (/^(https?:)?\/\//.test(linkPath)) return;
  if (/^[a-z][a-z0-9+.-]*:/i.test(linkPath)) return;
  if (linkPath.startsWith('#')) return;

  const cleanPath = linkPath.split(/[?#]/)[0];
  if (!cleanPath) return;

  if (cleanPath.startsWith('/')) {
    if (hasFileExtension(cleanPath) || cleanPath.startsWith('/img/') || cleanPath.startsWith('/assets/')) {
      validatePublicPath(file, cleanPath, 'markdown link');
      return;
    }

    const route = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
    if (!knownRoutes.has(route)) {
      fail(file, `markdown link points to unknown route: ${linkPath}`);
    }
    return;
  }

  if (hasFileExtension(cleanPath)) {
    const absolutePath = resolve(dirname(file), cleanPath);
    if (!existsSync(absolutePath)) {
      fail(file, `markdown link path does not exist: ${linkPath}`);
    }
  }
}

function validatePublicPath(file, publicPath, label) {
  if (!publicPath.startsWith('/')) return;

  const cleanPublicPath = publicPath.split(/[?#]/)[0];
  const absolutePath = join(publicDir, cleanPublicPath);
  if (!existsSync(absolutePath)) {
    fail(file, `${label} does not exist in public/: ${publicPath}`);
  }
}

function validateNoKramdownAttrs(file, source) {
  if (/\{:\s*[^}]+}/.test(source)) {
    fail(file, 'Kramdown attribute-lists are not supported; use MDX content components instead.');
  }

  if (/^\s*:::\s*(info|tip|note|warning|danger|caution|important|warn)\b/im.test(source)) {
    fail(file, 'remark directive callouts are not supported; use <Callout> in MDX instead.');
  }
}

function validateMarginalia(file, frontmatter, postImage) {
  if (!/^marginalia:/m.test(frontmatter)) return;

  const inlineValue = readFrontmatterValue(frontmatter, 'marginalia');
  const objectText = readNestedFrontmatterValue(frontmatter, 'marginalia', 'text');
  const objectQuote = hasNestedFrontmatterKey(frontmatter, 'marginalia', 'quote');
  const objectImage = readNestedFrontmatterValue(frontmatter, 'marginalia', 'image');
  const description = readFrontmatterValue(frontmatter, 'description');

  if (inlineValue && !['true', 'false'].includes(inlineValue)) {
    fail(file, 'marginalia must be true/false or a strict object.');
  }

  if (inlineValue === 'false') return;

  if (!objectText && !objectQuote && !description) {
    fail(file, 'marginalia requires text, quote, or a post description.');
  }

  if (!objectImage && !postImage) {
    fail(file, 'marginalia requires an image or a post image.');
  }

  if (objectImage) validatePublicPath(file, objectImage, 'marginalia image');
}

function validatePublicThreadBlock(file, source) {
  const block = source.match(/<!-- public:thread:start -->([\s\S]*?)<!-- public:thread:end -->/)?.[1];
  if (block === undefined) return;

  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const bullets = lines.filter((line) => /^[-*]\s+/.test(line));
  const summary = lines.find((line) => !/^[-*]\s+/.test(line)) ?? bullets[0]?.replace(/^[-*]\s+/, '');

  if (!summary) {
    fail(file, 'public thread block is empty; remove it or add a real public summary.');
  }

  if (bullets.length > 4) {
    fail(file, 'public thread block has more than 4 bullets; shorten it before publishing.');
  }
}

function getKnownRoutes() {
  const routes = new Set(['/', '/about/', '/posts/', '/tags/', '/worklog/']);

  for (const id of postIds) routes.add(`/posts/${id}/`);
  for (const id of worklogIds) routes.add(`/worklog/${id}/`);
  for (const id of tagIds) routes.add(`/tags/${id}/`);

  return routes;
}

function fail(file, message) {
  errors.push(`${relative(root, file)}: ${message}`);
}
