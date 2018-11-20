require("dotenv").config();

module.exports = {
  modules: [
    "@nuxtjs/dotenv",
    ["bootstrap-vue/nuxt", { css: false }],
    //  'vue-youtube-embed'
    [
      "nuxt-sass-resources-loader",
      {
        resources: require("./assets/scss/imports.js")
      }
    ]
  ],
  plugins: [
    // '~/plugins/vue-youtube-embed',
  ],
  css: ["~assets/css/fonts.css", "~assets/scss/app.scss"],
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
    vendor: ["axios"],
    css: ["~assets/css/fonts.css"],
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
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
  }
};
