// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://faizanmanshad.com',
  integrations: [react(), sitemap()],
  vite: {
    optimizeDeps: {
      include: [
        'three/examples/jsm/loaders/FontLoader.js',
        'three/examples/jsm/geometries/TextGeometry.js',
      ],
    },
  },
  image: {
    domains: ['media.faizanmanshad.com'],
  },
});