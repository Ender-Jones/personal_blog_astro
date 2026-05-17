import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import process from 'node:process';

const newBlogRoot = process.cwd();
const oldBlogCandidates = [
  process.env.OLD_BLOG_DIR,
  '/Users/ender/Documents/Git/Ender-Jones.github.io',
  join(newBlogRoot, 'reference/old_blog'),
].filter(Boolean);
const oldBlogRoot = oldBlogCandidates.find((dir) => existsSync(dir));
const errors = [];

if (!oldBlogRoot) {
  console.error(`Old blog directory not found. Checked: ${oldBlogCandidates.join(', ')}`);
  process.exit(1);
}

const oldPostEntries = listContentFiles(join(oldBlogRoot, '_posts')).map(readOldPost);
const oldPosts = oldPostEntries.filter((entry) => entry.date);
const oldDrafts = [
  ...oldPostEntries.filter((entry) => !entry.date),
  ...listContentFiles(join(oldBlogRoot, '_drafts')).map(readOldPost),
].filter((entry) => entry.title);
const newPosts = listMarkdown(join(newBlogRoot, 'src/content/posts')).map(readNewEntry);
const oldWorklogs = listMarkdown(join(oldBlogRoot, '_worklogs')).map(readOldWorklog);
const newWorklogs = listMarkdown(join(newBlogRoot, 'src/content/worklogs')).map(readNewEntry);
const newDrafts = listMarkdown(join(newBlogRoot, 'drafts')).map(readNewEntry).filter((entry) => entry.title);

compareEntries('post', oldPosts, newPosts);
compareEntries('worklog', oldWorklogs, newWorklogs);
compareDrafts(oldDrafts, newDrafts);

if (errors.length > 0) {
  console.error('Old blog audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Old blog audit passed: ${oldPosts.length} posts, ${oldWorklogs.length} worklogs, ${oldDrafts.length} drafts.`);

function listMarkdown(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => join(dir, name))
    .sort();
}

function listContentFiles(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((name) => !name.startsWith('.') && !name.endsWith('~'))
    .map((name) => join(dir, name))
    .sort();
}

function readOldPost(file) {
  const fm = readFrontmatter(file);
  const slug = basename(file)
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/\.md$/, '')
    .toLowerCase();

  return {
    file,
    slug,
    title: readField(fm, 'title'),
    date: readDate(fm),
  };
}

function readOldWorklog(file) {
  const fm = readFrontmatter(file);

  return {
    file,
    slug: basename(file, '.md'),
    title: readField(fm, 'title'),
    date: readDate(fm),
  };
}

function readNewEntry(file) {
  const fm = readFrontmatter(file);

  return {
    file,
    slug: basename(file, '.md'),
    title: readField(fm, 'title'),
    date: readDate(fm),
  };
}

function compareEntries(kind, oldEntries, newEntries) {
  const newByTitle = new Map(newEntries.map((entry) => [normalize(entry.title), entry]));

  for (const oldEntry of oldEntries) {
    const newEntry = newByTitle.get(normalize(oldEntry.title));

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
  const newByTitle = new Map(newEntries.map((entry) => [normalize(entry.title), entry]));

  for (const oldEntry of oldEntries) {
    if (!newByTitle.has(normalize(oldEntry.title))) {
      errors.push(`missing draft: ${oldEntry.title}`);
    }
  }
}

function readFrontmatter(file) {
  return readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
}

function readField(frontmatter, key) {
  return frontmatter.match(new RegExp(`^${key}:[ \\t]*[\"']?([^\\r\\n]*?)[\"']?[ \\t]*$`, 'm'))?.[1]?.trim() ?? '';
}

function readDate(frontmatter) {
  const raw = readField(frontmatter, 'date');
  if (!raw) return '';

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function normalize(value) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
