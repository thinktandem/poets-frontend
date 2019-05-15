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
          src: "https://www.googletagservices.com/tag/js/gpt.js"
        },
        GptAds.gatherMeData().gptInitScript
      ]
    };
  }
};
</script>

<style scoped>
</style>
