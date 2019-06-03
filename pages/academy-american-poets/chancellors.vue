<template>
  <div>
    <b-container>
      <CardDeck
        v-if="chancellors"
        :disabled="busy"
        cardtype="Chancellors"
        cols="3"
        :cards="chancellors"
      />
    </b-container>
    <b-container>
      <h2> Past Chancellors </h2>
      <CardDeck
        :disabled="busy"
        cardtype="Chancellors"
        cols="3"
        :cards="pastChancellors"/>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
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
    return {
      busy: true,
      chancellors: [],
      pastChancellors: []
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  },
  mounted() {
    Promise.all([this.getChancellors("current"), this.getChancellors("past")]);
  },
  methods: {
    getChancellors(type = "current") {
      this.busy = true;
      // Switch the operator based on the type (current or past).
      const switchOp = type === "current" ? "IS NULL" : "IS NOT NULL";
      const params = {
        query: {
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
                operator: switchOp,
                memberOf: "chancellorGroup"
              }
            }
          },
          sort: "title",
          include: "field_image"
        }
      };
      this.$api
        .getPersons(params)
        .then(response => {
          const myChancellors = _.map(response.data.data, person => ({
            title: _.get(person, "attributes.title"),
            img: this.$buildImg(
              response.data,
              person,
              "field_image",
              "portrait",
              {
                src: "/images/default-person.png",
                alt: _.get(person, "attributes.title") + " portrait"
              }
            ),
            job: _.get(person, "attributes.field_job_title"),
            bio:
              _.get(person, "attributes.body.summary") ||
              _.get(person, "attributes.body.processed"),
            link: _.get(person, "attributes.path.alias")
          }));
          if (type === "current") {
            this.chancellors = myChancellors;
          } else {
            this.pastChancellors = myChancellors;
          }
        })
        .catch(error => {
          console.log(error);
          return {
            chancellors: null
          };
        });
      this.busy = false;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
