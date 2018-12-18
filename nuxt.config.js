module.exports = {
  modules: [
    "@nuxtjs/auth",
    "@nuxtjs/axios",
    ["bootstrap-vue/nuxt", { css: false }],
    // 'vue-youtube-embed'
    [
      "nuxt-sass-resources-loader",
      {
        resources: require("./assets/scss/imports.js")
      }
    ]
  ],
  axios: {
    debug: process.env.APP_ENV !== "production"
  },
  auth: {
    strategies: {
      local: {
        // _scheme: "oauth2",
        endpoints: {
          login: {
            url: "/oauth/authorize",
            method: "post",
            propertyName: "access_token"
          },
          tokenRequired: true,
          tokenType: 'Bearer'
        }
      },
      "poets-api": {
        _scheme: "oauth2",
        authorization_endpoint: "/oauth/token",
        userinfo_endpoint: false,
        scope: ["vue_consumer"],
        response_type: "token",
        redirect_uri: "/login",
        client_id: process.env.API_CLIENT_ID,
        token_key: process.env.API_CLIENT_SECRET
      }
    }
  },
  plugins: [
    "~/plugins/axios",
    "~/plugins/vue2-filters"
    // '~/plugins/vue-youtube-embed',
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
        content: "Nuxt front end for Poets"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: "#3B8070" },
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
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
        config.node = {
          fs: "empty"
        };
      }
    }
  },
  env: {
    baseURL: process.env.API_URL || "https://poets.org"
  }
};
