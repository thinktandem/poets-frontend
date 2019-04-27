<template>
  <div>
    <AppNavigation />
    <promo-space variant="dark" />
    <AppHeroOuter
      v-if="$store.state.hero"
      :background="$store.state.hero.background"
      :variant="$store.state.hero.variant"
      :heading="$store.state.hero.heading"
      :lead="$store.state.hero.lead"
      :subtext="$store.state.hero.subtext"
    />
    <sub-navigation
      v-if="$store.state.subMenu"
      :links="$store.state.subMenu"
    />
    <nuxt />
    <AppNewsletterSupportFollow />
    <AppFooterPrimary />
    <AppFooterUtility />
  </div>
</template>

<script>
import AppNavigation from "~/components/AppNavigation";
import AppHeroOuter from "~/components/AppHero/AppHeroOuter";
import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
import AppNewsletterSupportFollow from "~/components/AppNewsletterSupportFollow/AppNewsletterSupportFollow";
import AppFooterPrimary from "~/components/AppFooter/AppFooterPrimary";
import AppFooterUtility from "~/components/AppFooter/AppFooterUtility";
import PromoSpace from "~/components/PromoSpace";
import GptAds from "~/plugins/gpt-ads";
import SubNavigation from "~/components/SubNavigation";
export default {
  components: {
    PromoSpace,
    AppNavigation,
    AppHeroOuter,
    AppAnnouncementsAwards,
    AppNewsletterSupportFollow,
    AppFooterPrimary,
    AppFooterUtility,
    SubNavigation
  },
  head() {
    return {
      script: [
        {
          src: "https://www.googletagservices.com/tag/js/gpt.js"
        },
        GptAds.gatherMeData().gptInitScript
      ]
    };
  },
  mounted() {
    // Make all Youtube embeds responsive.
    this.$el
      .querySelectorAll("iframe:not(.embed-responsive-item)")
      .forEach(el => {
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
