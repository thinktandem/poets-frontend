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

export default {
  components: {
    BasicPage
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, `/${route.path}`);
  }
};
</script>

<style scoped lang="scss">
/deep/ .button-grey {
  background: url("/icons/angle_r_w.png") no-repeat #c9c9c9 center right;
  display: inline-block;
  padding: 2px 16px 4px 12px !important;
  border-radius: 12px;
  line-height: 22px;
  color: #fff !important;
  text-decoration: none;
  font-size: 15px;
  font-weight: 800;
  border-right: 10px solid transparent !important;
  border-bottom: none !important;
}
/deep/ .button-grey:hover {
  background-color: #7f7f82;
}
</style>
