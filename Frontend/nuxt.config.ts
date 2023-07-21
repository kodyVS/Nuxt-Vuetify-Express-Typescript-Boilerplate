// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: "123",
    public: {
      apiBase: "http://localhost:3001/api/v1",
    },
  },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    server: {
      hmr: {
        port: 3005,
        clientPort: 3005,
      },
    },
  },
  modules: ["@pinia/nuxt"],
});
