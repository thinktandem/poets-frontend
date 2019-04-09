<template>
  <div>
    <b-container>
      <CardDeck
        cardtype="Board"
        cols="3"
        :cards="teacher"
      />
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import qs from "qs";
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
    const eacParams = qs.stringify({
      filter: {
        teacherGroup: {
          group: {
            conjunction: "AND"
          }
        },
        teacher: {
          condition: {
            path: "field_teacher",
            operator: "IS NOT NULL",
            memberOf: "teacherGroup"
          }
        },
        teacherEnd: {
          condition: {
            path: "field_teacher_end",
            operator: "IS NULL",
            memberOf: "teacherGroup"
          }
        }
      },
      sort: "title",
      include: "field_image"
    });
    return app.$axios.$get(`/api/node/person?${eacParams}`).then(response => {
      return {
        teacher: _.map(response.data, person => ({
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
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>
