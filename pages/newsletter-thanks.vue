<template>
  <div>
    thanks
    <DailyPoem />
    <AppAnnouncementsAwards />
  </div>
</template>

<script>
import DailyPoem from "~/components/Poems/DailyPoem";
import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
export default {
  layout: "default",
  components: {
   DailyPoem,
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
