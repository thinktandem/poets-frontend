<template>
  <div>
    <b-container>
      <CardDeck
        cardtype="Board"
        cols="3"
        :cards="board"
      />
    </b-container>
  </div>
</template>

<script>
import CardDeck from "~/components/CardDeck";
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    CardDeck
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {};
  },
  async asyncData({ app, store, params }) {
    return app.$axios
      .$get("/api/node/person", {
        params: {
          filter: {
            boardGroup: {
              group: {
                conjunction: "AND"
              }
            },
            board: {
              condition: {
                path: "field_board_member",
                operator: "IS NOT NULL",
                memberOf: "boardGroup"
              }
            },
            boardEnd: {
              condition: {
                path: "field_board_member_end",
                operator: "IS NULL",
                memberOf: "boardGroup"
              }
            }
          },
          sort: "title",
          include: "field_image"
        }
      })
      .then(response => {
        return {
          board: _.map(response.data, person => ({
            title: _.get(person, "attributes.title"),
            img: app.$buildImg(response, person, "field_image", "portrait", {
              src: "/images/default-person.png",
              alt: _.get(person, "attributes.title") + " portrait"
            }),
            job: _.get(person, "attributes.field_job_title"),
            bio:
              _.get(person, "attributes.body.summary") ||
              _.get(person, "attributes.body.processed"),
            link: _.get(person, "attributes.path.alias")
          }))
        };
      });
  },
  async fetch({ app, store, params }) {
    return app.$buildBasicPage(
      app,
      store,
      "/academy-american-poets/board-directors"
    );
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>
