<template>
  <div>
    <programs-announcements
      :program-options="programs"
      :announcements="announcements"/>
    <CardDeck
      title="Prizes"
      cardtype="PrizeCard"
      cols="4"
      :cards="prizes.prizes"
      :link="prizes.link"
    />
  </div>
</template>

<script>
import ProgramsAnnouncements from "~/components/ProgramsAnnouncements";
import CardDeck from "~/components/CardDeck";
import niceDate from "~/plugins/niceDate";
import qs from "qs";
import _ from "lodash";
import MetaTags from "~/plugins/metatags";

// Helper for announce paramz
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

// Helper for prize params
const prizeRequestParams = qs.stringify({
  filter: {
    field_program: 0,
    status: 1
  },
  page: {
    limit: 3
  }
});

// Helper to get program params
const programRequestParams = qs.stringify({
  filter: {
    field_program: 1
  },
  page: {
    limit: 3
  },
  include: "field_image"
});

export default {
  components: {
    ProgramsAnnouncements,
    CardDeck
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      announcements: {},
      prizes: {},
      programs: {}
    };
  },
  mounted() {
    Promise.all([
      this.getAnnouncements(),
      this.getPrizes(),
      this.getPrograms()
    ]);
  },
  methods: {
    getAnnouncements() {
      this.$axios
        .get(`/api/node/basic_page?${announcementRequestParams}`)
        .then(response => {
          this.announcements = {
            moreLink: {
              to: `/academy-american-poets/announcements`,
              text: "More Announcements"
            },
            announcements: _(_.get(response, "data.data", []))
              .map(item => ({
                date: niceDate.niceDate(_.get(item, "attributes.created")),
                body:
                  _.get(item, "attributes.body.summary") ||
                  _.get(item, "attributes.body.processed"),
                link: _.get(item, "attributes.path.alias", "")
              }))
              .value()
          };
        });
    },
    getPrizes() {
      this.$axios
        .get(`/api/node/prize_or_program?${prizeRequestParams}`)
        .then(response => {
          const count = _.get(response, "data.meta.count", 0);
          this.prizes = {
            title: "Prizes",
            link: {
              to: `/academy-american-poets/american-poets-prizes`,
              text: `${count} Prizes`
            },
            prizes: _(_.get(response, "data.data", []))
              .map(item => ({
                title: _.get(item, "attributes.title") || "",
                titleLink: _.get(item, "attributes.path.alias"),
                body:
                  _.get(item, "attributes.body.summary") ||
                  _.get(item, "attributes.body.processed")
              }))
              .value()
          };
        });
    },
    getPrograms() {
      this.$axios
        .get(`/api/node/prize_or_program?${programRequestParams}`)
        .then(response => {
          const count = _.get(response, "data.meta.count", 0);
          this.programs = {
            title: "Programs",
            moreLink: {
              to: `/academy-american-poets/programs`,
              text: `${count} Programs`
            },
            programs: _(_.get(response, "data.data", []))
              .map(item => ({
                title: _.get(item, "attributes.title"),
                titleLink: _.get(item, "attributes.path.alias"),
                body: _.get(item, "attributes.body.processed"),
                img:
                  _.get(item, "relationships.field_image.data").length >= 1
                    ? {
                        src: _.find(
                          _.get(response, "data.included"),
                          include =>
                            include.id ===
                            _.get(item, "relationships.field_image.data[0].id")
                        ).links.media_aside.href,
                        alt: _.get(
                          item,
                          "relationships.field_image.data[0].meta.alt"
                        )
                      }
                    : null
              }))
              .value()
          };
        });
    }
  },
  async fetch({ app, store, params, menu, route }) {
    // Set the current hero
    store.commit("updateHero", {
      variant: "default",
      lead:
        "The Academy of American Poets was founded in 1934 to support American poets at all stages of their careers and to foster the appreciation of contemporary poetry."
    });
    // Return the basic page as we do
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
</style>
