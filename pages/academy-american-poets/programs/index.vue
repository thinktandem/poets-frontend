<template>
  <list-page
    resource-type="prize_or_program"
    :default-params="defaultParams"
    :includes="includes"
    :fields="fields"
    :paged="paged"
    :per-page="perPage"/>
</template>

<script>
import ListPage from "~/components/ListPage";
import MetaTags from "~/plugins/metatags";

export default {
  components: { ListPage },
  head() {
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  data() {
    return {
      includes: {},
      fields: {
        title: { label: "Name" },
        body: { label: "Description" }
      },
      defaultParams: {
        filter: {
          field_program: 1
        }
      },
      filters: [],
      paged: false,
      perPage: 20
    };
  },

  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>
