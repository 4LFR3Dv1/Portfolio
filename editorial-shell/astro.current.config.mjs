import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://renan.snelabs.space',
  output: 'static',
  outDir: './current-dist',
  build: {
    format: 'directory',
  },
});
