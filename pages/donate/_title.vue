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
  components: { BasicPage },
  head() {
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
  },
  layout: "sparse",
  async asyncData({ app, store, route, error }) {
    return app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .catch(err => {
        error({ statusCode: 404, message: "" });
      })
      .then(res => {
        return app.$buildBasicPage(app, store, route.path, error, true);
      });
  }
};
</script>

<style scoped lang="scss">
</style>
