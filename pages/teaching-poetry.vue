<template>
  <div>
    <CardDeck
      title="Featured"
      class="pt-5 pb-3"
      cardtype="TextCard"
      cols="4"
      :featured="featured"
      :cards="texts"/>
    <list-page
      resource-type="texts"
      :default-params="defaultParams"
      :includes="includes"
      :fields="fields"/>
  </div>
</template>

<script>
import ListPage from "~/components/ListPage";
import CardDeck from "~/components/CardDeck";

export default {
  components: {
    ListPage,
    CardDeck
  },
  data() {
    return {
      includes: {
        field_contributors: "title"
      },
      fields: {
        field_contributors: { label: "Name" },
        title: { label: "Title" }
      },
      defaultParams: {
        filter: {
          "field_texttype.name": "on Teaching Poetry"
        }
      },
      featured: true
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  },
  async asyncData({ app, store, params, query }) {
    let texts = await app.$axios
      .get("/api/texts/1461", {})
      .then(res => {
        console.log(res);
        return {
          rows: res.data.rows
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      texts: texts.rows
    };
  }
};
</script>
