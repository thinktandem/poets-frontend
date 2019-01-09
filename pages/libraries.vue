<template>
  <div>
    <b-container>
      <CardDeck
        title="Books"
        cardtype="BookCard"
        cols="3"
        :cards="books"
        :link="bookLink"
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
    return {
      books: {}
    };
  },
  async asyncData({ app, params, query }) {
    const books = await app.$axios.get("/api/books", {}).then(res => {
      console.log("\n\n------------- res ---------\n\n", res.data);
      return {
        books: res.data
      };
    });
    console.log("\n\nbooks ------------\n\n", books);
    return {
      books: books
    };
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>
