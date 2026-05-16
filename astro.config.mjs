import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://enderjones.com',
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    plugins: [yaml()],
  },
});
