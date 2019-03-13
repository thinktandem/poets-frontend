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
      :default-params="defaultParams"
      :includes="includes"
      :filters="filters"
      :searchable="searchable"
      :fields="fields"/>
  </div>
</template>

<script>
import AppListing from "~/components/AppListing";
import BasicPage from "~/components/BasicPage";

export default {
  name: "ListPage",
  components: {
    AppListing,
    BasicPage
  },
  props: {
    includes: {
      type: Object,
      default: null
    },
    fields: {
      type: Object,
      default: null
    },
    filters: {
      type: Array,
      default: () => []
    },
    defaultParams: {
      type: Object,
      default: null
    },
    resourceType: {
      type: String,
      default: "poems"
    },
    searchable: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="css" scoped>
</style>
