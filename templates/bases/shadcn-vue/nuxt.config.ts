export default defineNuxtConfig({
  modules: ['@nuxt/cloudflare'],
  cloudflare: {
    pages: true,
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
});
