<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :extended-content="$store.state.extendedContent"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <app-listing
      resource-type="prize_or_program"
      :details="details"
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
    details: {
      type: Object,
      default: () => {}
    },
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
