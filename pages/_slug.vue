<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"/>
  </div>
</template>

<script>
import BasicPage from "~/components/BasicPage";
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    BasicPage
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path, true);
  }
};
</script>

<style scoped lang="scss">
</style>
