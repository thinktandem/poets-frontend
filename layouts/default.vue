<template>
  <div>
    <AppNavigation />
    <AppPromoSpace />
    <AppHeroOuter
      :variant="this.$store.state.hero.variant"
      :lead="this.$store.state.hero.lead"
      :subtext="this.$store.state.hero.subtext"
    />
    <nuxt/>
    <AppFooterPrimary />
    <AppFooterUtility />
  </div>
</template>

<script>
import AppNavigation from "~/components/AppNavigation";
import AppPromoSpace from "~/components/AppPromoSpace";
import AppHeroOuter from "~/components/AppHero/AppHeroOuter";
import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
import AppFooterPrimary from "~/components/AppFooter/AppFooterPrimary";
import AppFooterUtility from "~/components/AppFooter/AppFooterUtility";

export default {
  components: {
    AppNavigation,
    AppPromoSpace,
    AppHeroOuter,
    AppAnnouncementsAwards,
    AppFooterPrimary,
    AppFooterUtility
  }
};
</script>

<style>
</style>
