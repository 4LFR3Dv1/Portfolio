import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://renan.snelabs.space',
  base: '/editorial',
  srcDir: './publication-src',
  outDir: '../dist/editorial',
  output: 'static',
  build: {
    format: 'directory',
  },
});
