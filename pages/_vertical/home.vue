<template>
  <div>
    <programs-announcements
      :program-options="programOptions"
      :announcements="announcements"/>
  </div>
</template>

<script>
import ProgramsAnnouncements from "~/components/ProgramsAnnouncements";
import * as qs from "qs";
import * as _ from "lodash";
export default {
  components: {
    ProgramsAnnouncements
  },
  async asyncData({ app, params, query }) {
    const requestParams = qs.stringify({
      _format: "json",
      filter: {
        field_program: 1
      }
    });
    return app.$axios
      .$get(`/api/node/prize_or_program?${requestParams}`)
      .then(response => {
        return {
          response: response,
          programOptions: {
            title: "Programs",
            moreLink: {
              to: `/${params.vertical}/programs`,
              text: `${response.meta.count} Programs`
            },
            programs: _.map(response.data, item => {
              return {
                title: item.attributes.title,
                titleLink: item.attributes.path.alias,
                body: item.attributes.body.summary,
                imgId:
                  item.relationships.field_image.data.length >= 1
                    ? item.relationships.field_image.data[0].id
                    : null
              };
            })
          },
          announcements: []
        };
      });
  },
  async fetch({ app, store, params }) {
    // Set the current hero
    store.commit("updateHero", {
      variant: "default",
      lead:
        "The Academy of American Poets was founded in 1934 to support American poets at all stages of their careers and to foster the appreciation of contemporary poetry."
    });
  }
};
</script>

<style scoped lang="scss">
</style>
