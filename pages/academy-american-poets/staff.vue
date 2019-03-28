<template>
  <div>
    <b-container>
      <CardDeck
        cardtype="Staff"
        cols="3"
        :cards="staff"
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
  data() {
    return {};
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  async asyncData({ app, store, params }) {
    let staff = await app.$axios
      .get("/api/aap_staff", {})
      .then(res => {
        return {
          rows: res.data.rows
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      staff: staff.rows
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
