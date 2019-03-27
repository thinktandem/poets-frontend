<template>
  <div>
    <b-container>
      <CardDeck
        cardtype="EAC"
        cols="4"
        :cards="eac"
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
    let eac = await app.$axios
      .get("/api/aap_eac", {})
      .then(res => {
        return {
          rows: res.data.rows
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      eac: eac.rows
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
