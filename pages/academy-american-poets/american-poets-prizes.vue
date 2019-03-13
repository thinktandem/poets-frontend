<template>
  <div>
    <basic-page
      :body="$store.state.pageData.data.attributes.body"
      :extended-content="$store.state.extendedContent"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <app-listing
      resource-type="prize_or_program"
      :includes="includes"
      :fields="fields"/>
  </div>
</template>

<script>
import AppListing from "~/components/AppListing";
import BasicPage from "~/components/BasicPage";

export default {
  components: {
    AppListing,
    BasicPage
  },
  data() {
    return {
      includes: {},
      fields: {
        title: { label: "Name" }
      }
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>
