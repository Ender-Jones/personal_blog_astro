import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import process from 'node:process';
import {
  listContentFiles,
  listMarkdownFiles,
  normalizeText,
  readFrontmatterFile,
  readFrontmatterValue,
  stripExtension,
} from './lib/content-utils.mjs';

const newBlogRoot = process.cwd();
const oldBlogCandidates = [
  process.env.OLD_BLOG_DIR,
  '/Users/ender/Documents/Git/Ender-Jones.github.io',
].filter(Boolean);
const oldBlogRoot = oldBlogCandidates.find((dir) => existsSync(dir));
const errors = [];

if (!oldBlogRoot) {
  const message = `Old blog directory not found. Checked: ${oldBlogCandidates.join(', ')}`;

  if (process.env.AUDIT_OLD_BLOG_REQUIRED === '1') {
    console.error(message);
    process.exit(1);
  }

  console.warn(`${message}. Skipping old blog audit; set OLD_BLOG_DIR or AUDIT_OLD_BLOG_REQUIRED=1 to make this strict.`);
  process.exit(0);
}

const oldPostEntries = listContentFiles(join(oldBlogRoot, '_posts')).map(readOldPost);
const oldPosts = oldPostEntries.filter((entry) => entry.date);
const oldDrafts = [
  ...oldPostEntries.filter((entry) => !entry.date),
  ...listContentFiles(join(oldBlogRoot, '_drafts')).map(readOldPost),
].filter((entry) => entry.title);
const newPosts = listMarkdownFiles(join(newBlogRoot, 'src/content/posts')).map(readNewEntry);
const oldWorklogs = listMarkdownFiles(join(oldBlogRoot, '_worklogs')).map(readOldWorklog);
const newWorklogs = listMarkdownFiles(join(newBlogRoot, 'src/content/worklogs')).map(readNewEntry);
const newDrafts = listMarkdownFiles(join(newBlogRoot, 'drafts')).map(readNewEntry).filter((entry) => entry.title);

compareEntries('post', oldPosts, newPosts);
compareEntries('worklog', oldWorklogs, newWorklogs);
compareDrafts(oldDrafts, newDrafts);

if (errors.length > 0) {
  console.error('Old blog audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Old blog audit passed: ${oldPosts.length} posts, ${oldWorklogs.length} worklogs, ${oldDrafts.length} drafts.`);

function readOldPost(file) {
  const fm = readFrontmatterFile(file);
  const slug = basename(file)
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/\.md$/, '')
    .toLowerCase();

  return {
    file,
    slug,
    title: readFrontmatterValue(fm, 'title') ?? '',
    date: readDate(fm),
  };
}

function readOldWorklog(file) {
  const fm = readFrontmatterFile(file);

  return {
    file,
    slug: stripExtension(basename(file)),
    title: readFrontmatterValue(fm, 'title') ?? '',
    date: readDate(fm),
  };
}

function readNewEntry(file) {
  const fm = readFrontmatterFile(file);

  return {
    file,
    slug: stripExtension(basename(file)),
    title: readFrontmatterValue(fm, 'title') ?? '',
    date: readDate(fm),
  };
}

function compareEntries(kind, oldEntries, newEntries) {
  const newByTitle = new Map(newEntries.map((entry) => [normalizeText(entry.title), entry]));

  for (const oldEntry of oldEntries) {
    const newEntry = newByTitle.get(normalizeText(oldEntry.title));

    if (!newEntry) {
      errors.push(`missing ${kind}: ${oldEntry.title}`);
      continue;
    }

    if (oldEntry.date !== newEntry.date) {
      errors.push(`${kind} date mismatch for "${oldEntry.title}": old ${oldEntry.date}, new ${newEntry.date}`);
    }
  }
}

function compareDrafts(oldEntries, newEntries) {
  const newByTitle = new Map(newEntries.map((entry) => [normalizeText(entry.title), entry]));

  for (const oldEntry of oldEntries) {
    if (!newByTitle.has(normalizeText(oldEntry.title))) {
      errors.push(`missing draft: ${oldEntry.title}`);
    }
  }
}

function readDate(frontmatter) {
  const raw = readFrontmatterValue(frontmatter, 'date');
  if (!raw) return '';

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
