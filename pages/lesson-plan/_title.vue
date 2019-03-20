<template>
  <b-container>
    <b-row class="py-5">
      <b-col md="8">
        <div
          v-if="$store.state.pageData.data.attributes.body"
          v-html="$store.state.pageData.data.attributes.body.processed"/>
        {{ $store.state.pageData }}
      </b-col>
      <b-col
        md="4"
        tag="aside">
        <div v-if="$store.state.pageData.data.attributes.field_table_of_contents">
          <h3>Table of Contents</h3>
          <div
            v-html="$store.state.pageData.data.attributes.field_table_of_contents.processed"/>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  layout: "default",
  async fetch({ app, store, route }) {
    return app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .then(routerResponse => {
        return app.$axios
          .$get(routerResponse.jsonapi.individual)
          .then(response => {
            store.commit("updateHero", {
              variant: "default",
              heading: _.get(response, "data.attributes.title"),
              lead: _.get(response, "data.attributes.lead_text")
            });
            // Set the main page data
            store.commit("updatePageData", response);
            store.commit("updateSidebarData", []);
            store.commit("updateHighlightedData", []);
            store.commit("updateRelatedContent", []);
            store.commit("updateFeaturedContent", []);
            store.commit("updateExtendedContent", []);
          });
      })
      .catch(err => console.log(err));
  }
};
</script>
