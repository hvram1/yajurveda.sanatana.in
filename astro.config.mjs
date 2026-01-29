import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://hvram1.github.io',
  base: '/yajurveda.sanatana.in/',
  output: 'static',
  devToolbar: {
    enabled: false
  }
});
