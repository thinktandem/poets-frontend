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
    ],
    "@nuxtjs/toast"
  ],
  axios: {
    debug: process.env.APP_ENV !== "production"
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/oauth/token",
            method: "post",
            propertyName: "access_token"
          },
          user: false,
          logout: {
            url: "/user/logout",
            method: "post"
          },
          tokenRequired: true,
          tokenType: "Bearer"
        }
      },
      api: {
        _scheme: "oauth2",
        authorization_endpoint: "http://apipoetsd8.lndo.site/oauth/token",
        userinfo_endpoint: false,
        scope: ["vue_consumer"],
        response_type: "token",
        token_type: 'Bearer',
        redirect_uri: undefined,
        client_id: "b2c84c2c-b241-4611-b86e-7cc51801d0a1",
        token_key: 'access_token'
      },
      facebook: {
        client_id: "",
        userinfo_endpoint: false,
        scope: ["public_profile", "email"],
        redirect_uri: "/"
      },
      google: {
        client_id: "",
        user: false,
        redirect_uri: "/"
      }
    }
  },
  toast: {
    position: "top-left",
    className: "toast-success",
    theme: "bubble"
  },
  plugins: ["~/plugins/axios", "~/plugins/vue2-filters"],
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
