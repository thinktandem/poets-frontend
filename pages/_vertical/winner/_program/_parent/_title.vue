<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="12">
          <h1>{{ winner.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="replaceFileUrl(winner.prizeDetails)"
          class="program__body"
          xl="12"/>
      </b-row>
      <b-row>
        <b-col
          v-html="replaceFileUrl(winner.body)"
          class="program__body"
          md="8"/>
        <b-col md="4">
          <b-img-lazy
            fluid
            :src="winner.image.src"
            :alt="winner.image.alt"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import MetaTags from "~/plugins/metatags";
export default {
  head() {
    return MetaTags.renderTags(
      this.$route,
      this.winner.response.data.attributes.metatag_normalized
    );
  },
  async asyncData({ app, route }) {
    const routerResponse = await app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .catch(err => {
        error({ statusCode: 404, message: "" });
      });
    const winner = await app.$axios.$get(
      routerResponse.jsonapi.individual + "?include=field_image"
    );

    return {
      winner: {
        response: winner,
        title: _.get(winner, "data.attributes.title"),
        image: app.$buildImg(winner, null, "field_image", "portrait"),
        body: _.get(winner, "data.attributes.body.processed"),
        prizeDetails: _.get(
          winner,
          "data.attributes.field_progprize_details.processed"
        )
      }
    };
  },
  async fetch({ store, params }) {
    store.commit("updateHero", {
      heading: params.program === "programs" ? "Programs" : "Prize Winner"
    });
  }
};
</script>

<style scoped lang="scss">
.book__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>
