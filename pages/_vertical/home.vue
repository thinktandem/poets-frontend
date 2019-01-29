<template>
  <div>
    <programs-announcements
      :program-options="programs.data"
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
    const programRequestParams = qs.stringify({
      filter: {
        field_program: 1
      },
      include: "field_image"
    });
    const announcementRequestParams = qs.stringify({
      filter: {
        // Hard coded ID for announcement story type
        // @todo do some magic to make this dynamic
        "field_story_type.tid": 8
      },
      sort: {
        created: {
          path: "created",
          direction: "DESC"
        }
      },
      page: {
        limit: 4
      }
    });
    const programs = await app.$axios
      .$get(`/api/node/prize_or_program?${programRequestParams}`)
      .then(response => {
        return {
          response: response,
          data: {
            title: "Programs",
            moreLink: {
              to: `/${params.vertical}/programs`,
              text: `${response.meta.count} Programs`
            },
            programs: _.map(response.data, item => {
              return {
                item,
                title: item.attributes.title,
                titleLink: item.attributes.path.alias,
                body: item.attributes.body.processed,
                img:
                  item.relationships.field_image.data.length >= 1
                    ? {
                        src: _.find(
                          response.included,
                          include =>
                            include.id ===
                            item.relationships.field_image.data[0].id
                        ).links.media_aside.href,
                        alt:
                          item.relationships.field_image.data[0].meta.alt || ""
                      }
                    : null
              };
            })
          }
        };
      });

    const announcements = await app.$axios
      .$get(`/api/node/basic_page?${announcementRequestParams}`)
      .then(response => {
        return {
          response: response,
          moreLink: {
            to: `/${params.vertical}/annoucements`,
            text: "More Annoucements"
          },
          announcements: _.map(response.data, item => {
            return {
              date: item.attributes.changed,
              body:
                item.attributes.body.summary || item.attributes.body.processed,
              link: ""
            };
          })
        };
      });

    return { programs: programs, announcements: announcements };
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
