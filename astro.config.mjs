import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import sitemap from '@astrojs/sitemap';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GitHub Pages serves this project at a sub-path (activitydan.github.io/Spazio-Desk/),
// while Netlify (spaziodesk.com) serves it at the domain root — base/site must differ per target.
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

// https://astro.build/config
export default defineConfig({
  site: isGithubActions ? 'https://activitydan.github.io' : 'https://spaziodesk.com',
  base: isGithubActions ? '/Spazio-Desk/' : '/',
  scopedStyleStrategy: 'class',

  server: {
    host: true,
  },

  vite: {
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use 'sass:math'; @use 'sass:map'; @use "@/styles/import" as *;`
        }
      }
    },
    build: {
      assetsInlineLimit: 0
    }
  },

  devToolbar: {
    enabled: false
  },

  integrations: [
    sitemap({
      // Placeholder page, not linked from navigation — keep it out of
      // the sitemap so it doesn't dilute the site structure Google sees.
      filter: (page) => !page.includes('/work-in-progress'),
    })
  ]
});