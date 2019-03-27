<template>
  <list-page
    :details="details"
    resource-type="texts"
    :default-params="defaultParams"
    :includes="includes"
    :fields="fields"
    :filters="filters"
    :searchable="searchable"/>
</template>

<script>
import ListPage from "~/components/ListPage";

export default {
  components: {
    ListPage
  },
  data() {
    return {
      includes: {},
      fields: {
        title: { label: "Name" }
      },
      details: {
        body: {}
      },
      defaultParams: {
        filter: {
          status: 1,
          "field_texttype.tid": 661
        },
        sort: "-changed"
      },
      filters: [],
      searchable: [
        { field: "title", label: "name" },
        {
          field: "body.value",
          label: "text"
        }
      ]
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>
