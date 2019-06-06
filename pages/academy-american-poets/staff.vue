<template>
  <div>
    <b-container>
      <CardDeck
        cardtype="Staff"
        cols="3"
        :cards="staff"
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
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  async asyncData({ app, store, params }) {
    const staffParams = qs.stringify({
      filter: {
        staffGroup: {
          group: {
            conjunction: "AND"
          }
        },
        staff: {
          condition: {
            path: "field_staff",
            operator: "IS NOT NULL",
            memberOf: "staffGroup"
          }
        },
        staffEnd: {
          condition: {
            path: "field_staff_end",
            operator: "IS NULL",
            memberOf: "staffGroup"
          }
        }
      },
      sort: "title",
      include: "field_image"
    });
    return app.$axios.$get(`/api/node/person?${staffParams}`).then(response => {
      return {
        staff: _.map(response.data, person => ({
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
  }
};
</script>
