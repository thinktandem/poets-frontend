<template>
  <div>
    <b-container>
      <CardDeck
        cardtype="Board"
        cols="4"
        :cards="board"
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
