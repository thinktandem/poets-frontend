<template>
  <div>
    <b-container>
      <CardDeck
        title="Books"
        cardtype="BookCard"
        cols="3"
        :cards="books"
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
  async asyncData({ app, store, params }) {
    return app.$axios
      .get("/api/books", {})
      .then(res => {
        return {
          books: res.data
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>
