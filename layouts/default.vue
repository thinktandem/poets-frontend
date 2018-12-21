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

export default {
  components: {
    PromoSpace,
    AppNavigation,
    AppHeroOuter,
    AppAnnouncementsAwards,
    AppNewsletterSupportFollow,
    AppFooterPrimary,
    AppFooterUtility
  }
};
</script>

<style>
</style>
