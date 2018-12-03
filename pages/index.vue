<template>
  <div>
    <daily-poem
      :poem="$store.state.poemOfTheDay.poem"
      :poet="$store.state.poemOfTheDay.poet"/>
    <AppAnnouncementsAwards />
  </div>
</template>

<script>
import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
import DailyPoem from "../components/Poems/DailyPoem";
export default {
  layout: "default",
  components: {
    DailyPoem,
    AppAnnouncementsAwards
  },
  async fetch({ app, store, params }) {
    // Fetch all poems with poem a day date somewhere today.
    const response = await app.$axios.$get("/poem-a-day", {
      params: {
        _format: "json"
      }
    });
    // @todo: when we fix the author field, put a real author data pull in here.
    // Do the same with the link, we need to get a resource URL for the front end for the poem.
    store.commit("updatePoemOfTheDay", {
      poet: {
        name: response.poet.name,
        image: response.poet.image
      },
      poem: {
        link: "https://appUrl/announcementId",
        title: response.poem.title,
        text: response.poem.text
      }
    });
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
