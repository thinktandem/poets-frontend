<template>
  <div>
    thanks
    <AppAnnouncementsAwards />
  </div>
</template>

<script>
import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
export default {
  layout: "default",
  components: {
    AppPoemADayPoemsContainer,
    AppAnnouncementsAwards
  },
  fetch({ store, params }) {
    // Set the current hero
    store.commit("updateHero", {
      variant: "quote",
      lead: "This is a Quote"
    });
  }
};
</script>

<style>
</style>
