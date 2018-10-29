<template>
  <div>
    <AppPromoSpace />
    <AppHeroOuter
      variant="quote"
      lead="This is the homepage placeholder"
    >-Dustin LeBlanc, Tandem Developer (1985-)</AppHeroOuter>
    <AppPoemADayPoemsContainer />
    <AppAnnouncementsAwards />
  </div>
</template>

<script>
import AppPromoSpace from "~/components/AppPromoSpace";
import AppHeroOuter from "~/components/AppHero/AppHeroOuter";
import AppPoemADayPoemsContainer from "~/components/AppPoemADayPoems/AppPoemADayPoemsContainer";
import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
export default {
  layout: "default",
  components: {
    AppPromoSpace,
    AppHeroOuter,
    AppPoemADayPoemsContainer,
    AppAnnouncementsAwards
  }
};
</script>

<style>
</style>
