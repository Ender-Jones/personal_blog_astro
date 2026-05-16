import { getTagCounts, type PostEntry } from './content';

export type TagTone = 'research' | 'private';

export type TagSummary = {
  tag: string;
  count: number;
  tone: TagTone;
};

const RESEARCH_TAG_HINTS = [
  'ai',
  'claude',
  'evaluation',
  'gemini',
  'gpt',
  'llm',
  'machine',
  'prompt',
  'regression',
  'study',
];

export function getHomeTagSummary(posts: PostEntry[]): TagSummary[] {
  return getTagCounts(posts)
    .sort(([tagA, countA], [tagB, countB]) => countB - countA || tagA.localeCompare(tagB))
    .map(([tag, count]) => ({
      tag,
      count,
      tone: getTagTone(tag),
    }));
}

export function getTagTone(tag: string): TagTone {
  const normalized = tag.toLowerCase();
  return RESEARCH_TAG_HINTS.some((hint) => normalized.includes(hint)) ? 'research' : 'private';
}
