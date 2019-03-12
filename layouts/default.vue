<template>
  <div>
    <AppNavigation />
    <promo-space variant="dark" />
    <AppHeroOuter
      :variant="this.$store.state.hero.variant"
      :heading="this.$store.state.hero.heading"
      :lead="this.$store.state.hero.lead"
      :subtext="this.$store.state.hero.subtext"
    />
    <sub-navigation
      v-if="$store.state.subMenu"
      :links="$store.state.subMenu"/>
    <nuxt/>
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
  middleware: "menu",
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

<style>
</style>
