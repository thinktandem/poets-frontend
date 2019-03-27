<template>
  <div>
    <product-feature
      v-if="latest"
      :title="latest.title"
      :sub-title="latest.subTitle"
      :intro="latest.intro"
      :contents="latest.contents"
      :img="latest.img"
      :link="latest.link"/>
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
import ProductFeature from "~/components/ProductFeature";
export default {
  components: {
    BasicPage,
    ProductFeature
  },
  async asyncData({ app }) {
    const latest = await app.$latestMagazine({ app });
    return {
      latest
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>
