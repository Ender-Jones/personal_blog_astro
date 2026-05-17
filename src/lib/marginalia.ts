import { postHref, type PostEntry } from './content';

export type MarginaliaItem = {
  text: string;
  source: string;
  href: string;
  image: string;
  imageAlt: string;
  imageFocus: string;
};

export function getMarginaliaItems(posts: PostEntry[]): MarginaliaItem[] {
  return posts.flatMap((post) => {
    const item = getPostMarginalia(post);
    return item ? [item] : [];
  });
}

export function getRandomMarginalia(posts: PostEntry[], random = Math.random): MarginaliaItem | undefined {
  const items = getMarginaliaItems(posts);
  if (items.length === 0) return undefined;

  return items[Math.floor(random() * items.length)];
}

function getPostMarginalia(post: PostEntry): MarginaliaItem | undefined {
  const raw = post.data.marginalia;
  if (!raw) return undefined;

  const config = typeof raw === 'object' ? raw : {};
  const text = config.text ?? post.data.description;
  const image = config.image ?? post.data.image;

  if (!text || !image) return undefined;

  return {
    text,
    source: config.source ?? post.data.title,
    href: postHref(post),
    image,
    imageAlt: config.image_alt ?? post.data.image_alt ?? '',
    imageFocus: config.image_focus ?? post.data.image_focus ?? '50% 50%',
  };
}
