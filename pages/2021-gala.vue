<template>
  <b-container>
    <b-row class="basic_page__body">
      <b-col
        class="pb-2 basic_page__main">
        <div
          v-if="!empty(body)"
          v-html="replaceFileUrl(body.processed)"
          class="pb-4" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import MetaTags from "~/plugins/metatags";
import * as _ from "lodash";
export default {
  layout: "sparse",
  props: {
    pageData: {
      type: Object,
      default: null
    }
  },
  head() {
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  computed: {
    body() {
      return _.get(this.$store, "state.pageData.data.attributes.body");
    }
  },
  async fetch({ app, store, params, route, menu }) {
    return app.$buildBasicPage(app, store, route.path).then(() => {
      console.log("this", this, "store", store);
    });
  }
};
</script>
