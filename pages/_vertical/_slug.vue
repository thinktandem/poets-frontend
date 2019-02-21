<template>
  <div>
    <basic-page
      :body="$store.state.pageData.data.attributes.body"
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
    return app.$buildBasicPage(app, store, `${params.vertical}/${params.slug}`);
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
