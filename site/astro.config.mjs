// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://opcvibestack.com',
  trailingSlash: 'always',
  output: 'static',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  build: {
    format: 'directory',
  },
});
