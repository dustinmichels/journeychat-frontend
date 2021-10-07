export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "frontend",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
      // {
      //   rel: "stylesheet",
      //   type: "text/css",
      //   href:
      //     "https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css"
      // }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/styles.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ["nuxt-buefy", { materialDesignIcons: true }],
    "@nuxtjs/axios",
    "@nuxtjs/auth-next"
  ],

  axios: {
    baseURL: "http://127.0.0.1:8000/api/v1/"
  },

  auth: {
    redirect: {
      login: "/login",
      logout: "/goodbye",
      callback: "/login",
      home: "/"
    },
    strategies: {
      local: {
        token: {
          property: "access_token"
        },
        user: {
          property: false
        },
        endpoints: {
          login: {
            url: "auth/login",
            method: "post"
          },
          user: { url: "auth/me", method: "get", autoFetch: false },
          logout: false
        }
        // autoFetchUser: false
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
