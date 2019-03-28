<template>
  <list-page
    :details="details"
    resource-type="prize_or_program"
    :default-params="defaultParams"
    :includes="includes"
    :fields="fields"
    :filters="filters"
    :searchable="searchable"/>
</template>

<script>
import ListPage from "~/components/ListPage";
import MetaTags from "~/plugins/metatags";
export default {
  components: {
    ListPage
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      includes: {},
      fields: {
        title: { label: "Name" }
      },
      details: {},
      defaultParams: {
        filter: {
          field_program: 0
        }
      },
      filters: [],
      searchable: [
        { field: "title", label: "name" },
        {
          field: "body.value",
          label: "text"
        }
      ]
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>
