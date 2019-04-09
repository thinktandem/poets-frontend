<template>
  <div>
    <b-container>
      <CardDeck
        v-if="chancellors"
        cardtype="Chancellors"
        cols="3"
        :cards="chancellors"
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
  async asyncData({ app, store, params }) {
    const bigtime = qs.stringify({
      filter: {
        chancellorGroup: {
          group: {
            conjunction: "AND"
          }
        },
        chancellor: {
          condition: {
            path: "field_chancellor",
            operator: "IS NOT NULL",
            memberOf: "chancellorGroup"
          }
        },
        chancellorEnd: {
          condition: {
            path: "field_chancellor_end",
            operator: "IS NULL",
            memberOf: "chancellorGroup"
          }
        }
      },
      sort: "title",
      include: "field_image"
    });
    return app.$axios
      .$get(`/api/node/person?${bigtime}`)
      .then(response => {
        return {
          chancellors: _.map(response.data, person => ({
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
      })
      .catch(err => {
        console.log(err);
        return {
          chancellors: null
        };
      });
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
</style>
