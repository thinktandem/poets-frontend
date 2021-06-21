<template>
  <div>
    <b-container>
      <b-row class="basic_page__body">
        <b-col
          class="pb-2 basic_page__main"
          md="8">
          <div
            v-if="!empty(body)"
            v-html="replaceFileUrl(body.processed)"
            class="pb-4"/>
        </b-col>
      </b-row>
    </b-container>
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
      <h2> Chancellors Emeriti </h2>
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
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  computed: {
    body() {
      return _.get(this.$store, "state.pageData.data.attributes.body");
    }
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
          sort: "field_last_name",
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

<style lang="scss" scoped>
.basic_page__body {
  font-size: 1.25rem;
  font-weight: 400;
  .basic_page__main {
    div:first-child {
      margin-top: 3.6rem;
    }
  }
}
</style>
