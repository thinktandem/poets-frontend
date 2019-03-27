<template>
  <div>
    <programs-announcements
      :program-options="programs.data"
      :announcements="announcements"/>
    <CardDeck
      title="Prizes"
      cardtype="PrizeCard"
      cols="4"
      :cards="prizes.data.prizes"
      :link="prizes.data.link"
    />
  </div>
</template>

<script>
import ProgramsAnnouncements from "~/components/ProgramsAnnouncements";
import CardDeck from "~/components/CardDeck";
import * as qs from "qs";
import * as _ from "lodash";
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    ProgramsAnnouncements,
    CardDeck
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  async asyncData({ app, params, query }) {
    const programRequestParams = qs.stringify({
      filter: {
        field_program: 1
      },
      page: {
        limit: 3
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
    const prizeRequestParams = qs.stringify({
      filter: {
        field_program: 0,
        status: 1
      },
      page: {
        limit: 3
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
              to: `/academy-american-poets/programs`,
              text: `${response.meta.count} Programs`
            },
            programs: _.map(response.data, item => {
              return {
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
            to: `/annoucements`,
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
    const prizes = await app.$axios
      .$get(`/api/node/prize_or_program?${prizeRequestParams}`)
      .then(response => {
        return {
          response: response,
          data: {
            title: "Prizes",
            link: {
              to: `/prizes`,
              text: `${response.meta.count} Prizes`
            },
            prizes: _.map(response.data, item => {
              return {
                title: item.attributes.title || "",
                titleLink: item.attributes.path.alias,
                body:
                  item.attributes.body.summary || item.attributes.body.processed
              };
            })
          }
        };
      });

    return { programs: programs, announcements: announcements, prizes: prizes };
  },
  async fetch({ app, store, params, menu, route }) {
    // Set the current hero
    store.commit("updateHero", {
      variant: "default",
      lead:
        "The Academy of American Poets was founded in 1934 to support American poets at all stages of their careers and to foster the appreciation of contemporary poetry."
    });

    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
</style>
