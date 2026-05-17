import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import yaml from '@rollup/plugin-yaml';

const admonitionLabels = {
  info: 'Info',
  tip: 'Tip',
  note: 'Note',
  warning: 'Warning',
  danger: 'Danger',
};

const admonitionAliases = {
  caution: 'warning',
  warn: 'warning',
  important: 'danger',
};

function remarkAdmonitions() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'containerDirective' && node.type !== 'leafDirective') return;

      const normalizedName = node.name?.toLowerCase();
      const kind = admonitionAliases[normalizedName] ?? normalizedName;
      const label = admonitionLabels[kind];

      if (!label) return;

      applyAdmonition(node, kind, node.attributes?.title ?? label);
    });
  };
}

function remarkLegacyKramdownAttrs() {
  return (tree) => {
    walk(tree, (node) => {
      if (!Array.isArray(node.children)) return;

      const children = [];
      for (const child of node.children) {
        const promptKind = getPromptAttrKind(child);
        if (promptKind) {
          const previous = children[children.length - 1];
          if (previous) {
            applyAdmonition(previous, promptKind, admonitionLabels[promptKind]);
            continue;
          }
        }

        applyImageAttributes(child);
        children.push(child);
      }

      node.children = children;
    });
  };
}

function rehypeNormalizeLegacyImageAttrs() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'img') return;
      if (!node.properties?.className?.includes?.('legacy-image')) return;

      for (const key of ['width', 'height']) {
        const value = node.properties[key];
        if (value === undefined) continue;

        const normalizedValue = String(value).match(/\d+/)?.[0];
        if (normalizedValue) node.properties[key] = Number(normalizedValue);
      }
    });
  };
}

function applyAdmonition(node, kind, title) {
  node.data ??= {};
  node.children ??= [];
  node.data.hName = 'aside';
  node.data.hProperties = {
    className: ['admonition', `admonition--${kind}`],
    'data-admonition': kind,
  };

  const firstChild = node.children[0];
  const alreadyTitled =
    firstChild?.data?.hProperties?.className?.includes?.('admonition__title') ?? false;

  if (!alreadyTitled) {
    node.children.unshift({
      type: 'paragraph',
      data: {
        hName: 'p',
        hProperties: { className: ['admonition__title'] },
      },
      children: [{ type: 'text', value: title }],
    });
  }
}

function getPromptAttrKind(node) {
  if (node.type !== 'paragraph') return undefined;
  if (!Array.isArray(node.children) || node.children.length !== 1) return undefined;

  const value = node.children[0]?.value;
  if (typeof value !== 'string') return undefined;

  const match = value.match(/^\s*\{:\s*\.prompt-(info|tip|note|warning|danger)\s*}\s*$/);
  if (!match) return undefined;

  return match[1];
}

function applyImageAttributes(node) {
  if (node.type !== 'paragraph' || !Array.isArray(node.children)) return;

  const nextChildren = [];
  let frameClasses = [];

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];
    const next = node.children[index + 1];

    if (child.type === 'image' && next?.type === 'text') {
      const match = next.value.match(/^\s*\{:\s*([^}]+)}\s*$/);
      const attributes = match ? parseKramdownAttributes(match[1]) : undefined;

      if (attributes) {
        child.data ??= {};
        child.data.hProperties = {
          ...child.data.hProperties,
          ...(attributes.width ? { width: attributes.width } : {}),
          ...(attributes.height ? { height: attributes.height } : {}),
          loading: 'lazy',
          className: ['legacy-image'],
        };
        frameClasses = attributes.classes.map((className) => `legacy-image-frame--${className}`);
        nextChildren.push(child);
        index += 1;
        continue;
      }
    }

    nextChildren.push(child);
  }

  if (frameClasses.length === 0) return;

  node.children = nextChildren;
  node.data ??= {};
  node.data.hName = 'figure';
  node.data.hProperties = {
    className: ['legacy-image-frame', ...frameClasses],
  };
}

function parseKramdownAttributes(rawAttributes) {
  const attributes = { classes: [] };
  const tokens = rawAttributes.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];

  for (const token of tokens) {
    if (token.startsWith('.')) {
      attributes.classes.push(token.slice(1));
      continue;
    }

    const match = token.match(/^([a-zA-Z][\w-]*)=(?:"([^"]*)"|'([^']*)'|(.+))$/);
    if (!match) return undefined;

    const [, key, doubleQuotedValue, singleQuotedValue, unquotedValue] = match;
    const value = normalizeKramdownAttributeValue(doubleQuotedValue ?? singleQuotedValue ?? unquotedValue);
    if (key === 'width' || key === 'height') attributes[key] = Number(value);
  }

  return attributes.classes.length > 0 || attributes.width || attributes.height
    ? attributes
    : undefined;
}

function normalizeKramdownAttributeValue(value) {
  return value.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').match(/\d+/)?.[0] ?? value;
}

function walk(node, visitor) {
  visitor(node);

  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    walk(child, visitor);
  }
}

export default defineConfig({
  site: 'https://enderjones.com',
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath, remarkDirective, remarkLegacyKramdownAttrs, remarkAdmonitions],
    rehypePlugins: [rehypeKatex, rehypeNormalizeLegacyImageAttrs],
  },
  vite: {
    plugins: [yaml()],
  },
});
