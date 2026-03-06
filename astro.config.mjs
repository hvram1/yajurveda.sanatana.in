import { defineConfig } from 'astro/config';

// Environment-based configuration
// Set DEPLOY_TARGET=production for production build, otherwise preview
const isProduction = process.env.DEPLOY_TARGET === 'production';

// https://astro.build/config
export default defineConfig({
  site: isProduction 
    ? 'https://yajurveda.sanatana.in' 
    : 'https://hvram1.github.io',
  base: isProduction ? '/' : '/yajurveda.sanatana.in/',
  output: 'static',
  devToolbar: {
    enabled: false
  }
});
