module.exports = {
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "cookie-universal-nuxt",
    "@nuxtjs/google-analytics",
    "@nuxtjs/sentry",
    "@nuxtjs/sitemap",
    "@nuxtjs/toast",
    [
      "nuxt-sass-resources-loader",
      [
        "~/assets/scss/_bootstrap-variables.scss",
        "~/assets/scss/_custom-variables.scss",
        "bootstrap/scss/_functions.scss",
        "bootstrap/scss/_variables.scss",
        "bootstrap/scss/_mixins.scss",
        "~/assets/scss/base/_mixins.scss"
      ]
    ],
    ["bootstrap-vue/nuxt", { css: false }]
  ],
  axios: {
    debug: process.env.NODE_ENV !== "production"
  },
  auth: {
    redirect: false,
    cookie: {
      prefix: "auth.",
      options: {
        path: "/",
        secure: true
      }
    },
    strategies: {
      drupal: {
        _scheme: "~/plugins/drupal-auth.js"
      }
    }
  },
  "google-analytics": {
    id: "UA-31095-1"
  },
  sitemap: {
    path: "/sitemap.xml",
    hostname: "https://poets.org",
    cacheTime: 1000 * 15 * 24 * 60 * 60,
    gzip: true,
    exclude: ["submit-sitemap"],
    async routes() {
      const sitemapHelpers = require("./plugins/sitemap-helpers");
      return sitemapHelpers.allTheUrls();
    }
  },
  serverMiddleware: [
    "~/serverMiddleware/headers.js",
    { path: "/tweets", handler: "~/serverMiddleware/tweets.js" }
  ],
  router: {
    middleware: ["menu", "post-data", "redirects", "isa"]
  },
  toast: {
    position: "top-left",
    className: "toast-success",
    theme: "bubble"
  },
  plugins: [
    "~/plugins/axios",
    "~/plugins/vue2-filters",
    "~/plugins/asyncComputed",
    "~/plugins/apiv2",
    "~/plugins/globalComponents",
    "~/plugins/poets-api",
    "~/plugins/mixins"
  ],
  css: ["~assets/scss/app.scss"],
  /*
  ** Headers of the page
  */
  head: {
    title: "Poets.org",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "poets.org - The Academy of American Poets is the largest membership-based nonprofit organization fostering an appreciation for contemporary poetry and supporting American poets."
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico?v2" }],
    script: [
      { src: "//widgets.getsitecontrol.com/190727/script.js", body: true }
    ]
  },
  /*
   * Customize the progress bar color
   */
  loading: { color: "#F53F5B", height: "5px" },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      const svgRule = config.module.rules.find(rule => rule.test.test(".svg"));

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        loader: "vue-svg-loader",
        options: {
          svgo: {
            plugins: [{ prefixIds: true }, { removeViewBox: false }]
          }
        }
      });
      config.node = { fs: "empty" };
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },
  render: {
    // Tell Browsers to cache static assets for 1 year (makes Google happy).
    static: {
      maxAge: 1000 * 60 * 60 * 24 * 365
    }
  },
  env: {
    baseURL: process.env.API_URL || "https://api.poets.org",
    appURL: process.env.appURL || "https://poets.org",
    CACHE_TTL: process.env.CACHE_TTL || 300,
    CONSUMER_ID: process.env.CONSUMER_ID,
    CONSUMER_SECRET: process.env.CONSUMER_SECRET,
    ONEALL_SUBDOMAIN: process.env.ONEALL_SUBDOMAIN,
    ONEALL_PRIVATE_KEY: process.env.ONEALL_PRIVATE_KEY,
    ONEALL_PUBLIC_KEY: process.env.ONEALL_PUBLIC_KEY,
    TWIT_CONSUMER_KEY: process.env.TWIT_CONSUMER_KEY,
    TWIT_CONSUMER_SECRET: process.env.TWIT_CONSUMER_SECRET,
    TWIT_ACCESS_TOKEN: process.env.TWIT_ACCESS_TOKEN,
    TWIT_TOKEN_SECRET: process.env.TWIT_TOKEN_SECRET
  }
};
