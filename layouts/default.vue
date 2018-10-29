<template>
  <div>
    <AppNavigation />
    <nuxt/>
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
import AppFooterPrimary from "~/components/AppFooter/AppFooterPrimary";
import AppFooterUtility from "~/components/AppFooter/AppFooterUtility";

export default {
  components: {
    AppNavigation,
    AppPromoSpace,
    AppHeroOuter,
    AppPoemADayPoemsContainer,
    AppAnnouncementsAwards,
    AppFooterPrimary,
    AppFooterUtility
  }
};
</script>

<style>
</style>
