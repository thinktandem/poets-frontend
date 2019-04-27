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
import MetaTags from "~/plugins/metatags";
export default {
  components: {
    BasicPage,
    ProductFeature
  },
  data() {
    return {
      latest: {}
    };
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  mounted() {
    this.$api.getLatestMagazine().then(magazine => {
      this.latest = this.$latestMagazine(_.get(magazine, "data"));
    });
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>
