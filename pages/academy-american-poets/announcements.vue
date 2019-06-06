<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :extended-content="$store.state.extendedContent"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <app-listing
      resource-type="basic_page"
      :default-params="defaultParams"
      :includes="includes"
      :fields="fields"/>
  </div>
</template>

<script>
import BasicPage from "~/components/BasicPage";
import AppListing from "~/components/AppListing";
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    BasicPage,
    AppListing
  },
  head() {
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  data() {
    return {
      includes: {
        field_story_type: "tid"
      },
      fields: {
        title: { label: "Title" },
        created: { label: "Date" }
      },
      defaultParams: {
        filter: {
          "field_story_type.tid": 8
        }
      },
      featured: true
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
</style>
