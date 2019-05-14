<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :extended-content="$store.state.extendedContent"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"
    />
    <app-listing
      :resource-type="resourceType"
      :title="title"
      :details="details"
      :default-params="defaultParams"
      :includes="includes"
      :filters="filters"
      :searchable="searchable"
      :fields="fields"
      :paged="paged"
      :per-page="perPage"
    />
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
    title: {
      type: String,
      default: ""
    },
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
    },
    stacked: {
      type: String,
      default: "sm"
    },
    perPage: {
      type: Number,
      default: 10
    },
    paged: {
      type: Boolean,
      default: true
    }
  }
};
</script>
