// @ts-check
import { defineConfig } from 'astro/config';

import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

/** @type {() => import('astro').AstroIntegration} */
const sitemapMirror = () => ({
  name: 'sitemap-mirror',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const distDir = fileURLToPath(dir);
      const sitemap0 = path.join(distDir, 'sitemap-0.xml');
      const sitemapTarget = path.join(distDir, 'sitemap.xml');
      try {
        await fs.copyFile(sitemap0, sitemapTarget);
      } catch {}
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: 'https://faizanmanshad.com',
  integrations: [react(), sitemap(), sitemapMirror()],
  vite: {
    resolve: {
      alias: [
        {
          find: '@react-three/fiber',
          replacement: '@react-three/fiber/dist/react-three-fiber.esm.js',
        },
      ],
    },
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