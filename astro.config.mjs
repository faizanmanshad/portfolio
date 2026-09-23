// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://faizanmanshad.github.io',
  base: '/portfolio',
  integrations: [react()],
  vite: {
    optimizeDeps: {
      include: [
        'three/examples/jsm/loaders/FontLoader.js',
        'three/examples/jsm/geometries/TextGeometry.js',
      ],
    },
  },
});