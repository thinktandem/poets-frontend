<template>
  <div>
    <b-container>
      <CardDeck
        cardtype="Board"
        cols="3"
        :cards="board"
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
    let board = await app.$axios
      .get("/api/aap_board", {})
      .then(res => {
        return {
          rows: res.data.rows
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      board: board.rows
    };
  },
  async fetch({ app, store, params }) {
    return app.$buildBasicPage(
      app,
      store,
      "/academy-american-poets/board-directors"
    );
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>
