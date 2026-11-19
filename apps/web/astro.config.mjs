// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static site → Cloudflare Pages. The API lives in apps/api (Cloudflare Worker).
export default defineConfig({
  site: 'https://www.sharkdrivingschool.co.uk', // TODO(owner): confirm final domain
  output: 'static',
  integrations: [
    // sitemap-index.xml for Google Search Console. The 404 page is excluded automatically.
    sitemap({
      lastmod: new Date(),
      changefreq: 'monthly',
      priority: 0.7,
      // The homepage is the most important URL.
      serialize: (item) => (item.url === 'https://www.sharkdrivingschool.co.uk/' ? { ...item, priority: 1 } : item),
    }),
  ],
  build: { inlineStylesheets: 'auto' },
  vite: {
    server: {
      // `npm run dev` at the repo root runs the API on :8787; proxy it so the browser calls /api/*.
      proxy: { '/api': 'http://localhost:8787' },
    },
  },
});
