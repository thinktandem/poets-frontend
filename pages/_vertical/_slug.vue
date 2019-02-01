<template>
  <div>
    <basic-page
      :body="$store.state.pageData.attributes.body.processed"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"/>
  </div>
</template>

<script>
import BasicPage from "~/components/BasicPage";
export default {
  components: {
    BasicPage
  },
  async fetch({ app, store, params }) {
    return app.$buildBasicPage(app, store, `${param.vertical}/${params.slug}`);
  }
};
</script>

<style scoped lang="scss">
</style>
