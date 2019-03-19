<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="12">
          <h1>{{ title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="body"
          class="program__body"
          md="8"/>
        <b-col md="4">
          <b-img-lazy
            fluid
            center
            :src="image.src"
            :alt="image.alt"/>
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
    return MetaTags.renderTags(this.tags);
  },
  async asyncData({ app, route }) {
    const routerResponse = await app.$axios.$get(
      `/router/translate-path?path=${route.path}`
    );

    return app.$axios
      .$get(routerResponse.jsonapi.individual + "?include=field_image")
      .then(program => ({
        title: _.get(program, "data.attributes.title"),
        body: _.get(program, "data.attributes.body.processed"),
        image: app.$buildImg(program, null, "field_image", "media_aside_lg"),
        tags: program.data.attributes.metatag_normalized
      }));
  },
  async fetch({ store }) {
    store.commit("updateHero", {
      heading: "Programs"
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
