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
import * as moment from "moment";
import _ from "lodash";
export default {
  layout: "default",
  components: {
    DailyPoem,
    AppAnnouncementsAwards
  },
  async fetch({ app, store, params }) {
    // Fetch all poems with poem a day date somewhere today.
    const dateFilter = {
      condition: {
        path: "field_poem_of_the_day_date",
        operator: "BETWEEN",
        value: [
          moment()
            .hour(0)
            .minute(0)
            .second(0)
            .unix(),
          moment()
            .hour(23)
            .minute(59)
            .second(59)
            .unix()
        ]
      }
    };
    const response = await app.$axios.$get("/api/node/poems", {
      params: {
        _format: "json",
        filter: {
          date: dateFilter
        },
        fields: {
          "node--poems": "title,body,field_author,field_soundcloud_embed_code"
        },
        includes: "field_author"
      }
    });
    if (response.data.length < 0) {
      const poem = _.first(response.data);
      // @todo: when we fix the author field, put a real author data pull in here.
      // Do the same with the link, we need to get a resource URL for the front end for the poem.
      store.commit("updatePoemOfTheDay", {
        poet: {
          name: "Gabrielle Calvocoressi",
          image: "/images/gc.png"
        },
        poem: {
          link: "https://appUrl/announcementId",
          title: poem.attributes.title,
          text: poem.attributes.body.processed
        }
      });
    }
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
