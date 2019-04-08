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
import AppNewsletterSupportFollow from "~/components/AppNewsletterSupportFollow/AppNewsletterSupportFollow";
import AppFooterPrimary from "~/components/AppFooter/AppFooterPrimary";
import AppFooterUtility from "~/components/AppFooter/AppFooterUtility";
export default {
  components: {
    AppNavigation,
    AppNewsletterSupportFollow,
    AppFooterPrimary,
    AppFooterUtility
  }
};
</script>

<style>
</style>
