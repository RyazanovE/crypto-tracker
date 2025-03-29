import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      BINANCE_API_URL: process.env.BINANCE_API_URL,
    },
  },
  compatibilityDate: '2025-01-30',
  devtools: { enabled: true },
  css: ['vuetify/styles'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error config exception
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});