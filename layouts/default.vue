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
    <AppNewsletterSupportFollow />
    <AppFooterPrimary />
    <AppFooterUtility />
  </div>
</template>

<script>
import AppNavigation from "~/components/AppNavigation";
import AppPromoSpace from "~/components/AppPromoSpace";
import AppHeroOuter from "~/components/AppHero/AppHeroOuter";
import AppPoemADayPoemsContainer from "~/components/AppPoemADayPoems/AppPoemADayPoemsContainer";
import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
import AppNewsletterSupportFollow from "~/components/AppNewsletterSupportFollow/AppNewsletterSupportFollow";
import AppFooterPrimary from "~/components/AppFooter/AppFooterPrimary";
import AppFooterUtility from "~/components/AppFooter/AppFooterUtility";

export default {
  components: {
    AppNavigation,
    AppPromoSpace,
    AppHeroOuter,
    AppPoemADayPoemsContainer,
    AppAnnouncementsAwards,
    AppNewsletterSupportFollow,
    AppFooterPrimary,
    AppFooterUtility
  }
};
</script>

<style>
</style>
