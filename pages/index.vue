<template>
  <div>
    <daily-poem
      :poem="$store.state.poemOfTheDay.poem"
      :poet="$store.state.poemOfTheDay.poet"/>
    <promo-space variant="transparent"/>
  </div>
</template>

<script>
import DailyPoem from "~/components/Poems/DailyPoem";
import PromoSpace from "~/components/PromoSpace";
import * as _ from "lodash";
export default {
  layout: "default",
  components: {
    DailyPoem,
    PromoSpace
  },
  async asyncData({ app, store, params }) {
    return {
      poems: {}
    };
  },
  async fetch({ app, store, params }) {
    // Fetch all poems with poem a day date somewhere today.
    const response = await app.$axios.$get("/poem-a-day", {
      params: {
        _format: "json"
      }
    });
    const theOne = _.first(response);
    store.commit("updatePoemOfTheDay", {
      poet: {
        name: theOne.poet.name,
        image: theOne.poet.image
      },
      poem: {
        link: "https://appUrl/announcementId",
        title: theOne.poem.title,
        text: theOne.poem.text
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
