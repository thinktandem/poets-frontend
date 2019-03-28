<template>
  <div>
    <AppNavigation />
    <nuxt/>
    <AppNewsletterSupportFollow />
    <AppFooterPrimary />
    <AppFooterUtility />
  </div>
</template>

<script>
import AppNavigation from "~/components/AppNavigation";
import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
import AppNewsletterSupportFollow from "~/components/AppNewsletterSupportFollow/AppNewsletterSupportFollow";
import AppFooterPrimary from "~/components/AppFooter/AppFooterPrimary";
import AppFooterUtility from "~/components/AppFooter/AppFooterUtility";
import GptAds from "~/plugins/gpt-ads";
export default {
  components: {
    AppNavigation,
    AppAnnouncementsAwards,
    AppNewsletterSupportFollow,
    AppFooterPrimary,
    AppFooterUtility
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
body {
  background: #605b56;
}
</style>
