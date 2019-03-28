<template>
  <div>
    <b-container>
      <CardDeck
        cardtype="Chancellors"
        cols="3"
        :cards="chancellors"
      />
    </b-container>
  </div>
</template>

<script>
import CardDeck from "~/components/CardDeck";
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    CardDeck
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {};
  },
  async asyncData({ app, store, params }) {
    let chancellors = await app.$axios
      .get("/api/aap_chancellors", {})
      .then(res => {
        return {
          rows: res.data.rows
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      chancellors: chancellors.rows
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>
