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

export default {
  components: {
    CardDeck
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
  async fetch({ app, store, params }) {
    return app.$buildBasicPage(app, store, "/chancellors");
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
/deep/ .poet__name /deep/ h3 {
  font-size: 1.44rem;
  line-height: inherit;
}
</style>
