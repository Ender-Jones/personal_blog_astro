import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://enderjones.com',
  output: 'static',
  integrations: [mdx()],
});
