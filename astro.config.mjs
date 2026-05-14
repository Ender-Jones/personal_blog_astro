import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import yaml from '@rollup/plugin-yaml';

export default defineConfig({
  site: 'https://enderjones.com',
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [yaml()],
  },
});
