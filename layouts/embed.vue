<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
import GptAds from "~/plugins/gpt-ads";
export default {
  name: "Embed",
  head() {
    return {
      script: [
        {
          src: "https://www.googletagservices.com/tag/js/gpt.js",
          defer: true
        },
        GptAds.gatherMeData().gptInitScript
      ],
      link: [
        {
          rel: "preconnect",
          href: "https://pixel.yabidos.com",
          crossorigin: "true"
        },
        {
          rel: "preconnect",
          href: "https://www.google-analytics.com",
          crossorigin: "true"
        },
        {
          rel: "preconnect",
          href: "https://pre.glotgrx.com",
          crossorigin: "true"
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>
