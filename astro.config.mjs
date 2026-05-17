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

      node.data ??= {};
      node.attributes ??= {};
      node.children ??= [];
      node.data.hName = 'aside';
      node.data.hProperties = {
        className: ['admonition', `admonition--${kind}`],
        'data-admonition': kind,
      };
      node.children.unshift({
        type: 'paragraph',
        data: {
          hName: 'p',
          hProperties: { className: ['admonition__title'] },
        },
        children: [{ type: 'text', value: node.attributes.title ?? label }],
      });
    });
  };
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
    remarkPlugins: [remarkMath, remarkDirective, remarkAdmonitions],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [yaml()],
  },
});
