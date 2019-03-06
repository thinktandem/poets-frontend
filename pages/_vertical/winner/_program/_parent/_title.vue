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
          v-html="winner.body"
          class="program__body"
          xl="12"/>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  async asyncData({ app, route }) {
    const routerResponse = await app.$axios.$get(
      `/router/translate-path?path=${route.path}`
    );
    const winner = await app.$axios.$get(routerResponse.jsonapi.individual);

    return {
      winner: {
        response: winner,
        title: _.get(winner, "data.attributes.title"),
        body: _.get(winner, "data.attributes.body.processed")
      }
    };
  },
  async fetch({ store }) {
    store.commit("updateHero", {
      heading: "Prize Winner"
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
