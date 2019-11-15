<template>
  <div>
    <interstitial-advert />
    <AppNavigation :sparse="true" />
    <AppHeroOuter
      v-if="$store.state.hero"
      :background="$store.state.hero.background"
      variant="sparse"
      :heading="$store.state.hero.heading"
      :lead="$store.state.hero.lead"
      :subtext="$store.state.hero.subtext"
    />
    <nuxt />
    <AppFooterUtility />
  </div>
</template>

<script>
import AppNavigation from "~/components/AppNavigation";
import AppHeroOuter from "~/components/AppHero/AppHeroOuter";
import AppFooterUtility from "~/components/AppFooter/AppFooterUtility";
import InterstitialAdvert from "~/components/InterstitialAdvert";
export default {
  components: {
    AppNavigation,
    AppHeroOuter,
    AppFooterUtility,
    InterstitialAdvert
  },
  head() {
    return {
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
        },
        {
          rel: "preload",
          href: "/_nuxt/fonts/poets_electra_web_roman.1b767f4.woff",
          as: "font",
          type: "font/woff",
          crossorigin: "true"
        }
      ]
    };
  },
  mounted() {
    // Make all Youtube embeds responsive.
    this.$el
      .querySelectorAll("iframe:not(.embed-responsive-item)")
      .forEach(el => {
        el.setAttribute("scrolling", "yes");
        const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (youtubeRegex.test(el.getAttribute("src"))) {
          el.classList.add("embed-responsive-item");
          const wrapper = document.createElement("div");
          wrapper.classList.add("embed-responsive", "embed-responsive-16by9");
          el.parentNode.insertBefore(wrapper, el);
          wrapper.appendChild(el);
        }
      });
  }
};
</script>

<style lang="scss">
#__layout {
  margin-top: $header-height--xs;

  @include media-breakpoint-up(md) {
    margin-top: 0;
  }
}
</style>
