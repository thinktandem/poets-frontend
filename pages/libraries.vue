<template>
  <div>
    <b-container
      fluid
      class="libraries__poets-deck">
      <CardDeck
        title="Poets"
        cardtype="Poet"
        cols="4"
        :cards="poets"
        :link="poetsLink"
      />
    </b-container>
    <b-container>
      <CardDeck
        title="Texts"
        cardtype="TextCard"
        cols="4"
        :cards="texts"
        :link="textsLink"
      />
    </b-container>
    <b-container>
      <CardDeck
        title="Books"
        cardtype="BookCard"
        cols="3"
        :cards="books"
        :link="booksLink"
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
      poets: {},
      poetsLink: {
        to: "/poetsorg/poet",
        text: "0"
      },
      texts: {},
      textsLink: {
        to: "/poetsorg/text",
        text: "0"
      },
      books: {},
      booksLink: {
        to: "/poetsorg/book",
        text: "0"
      }
    };
  },
  async asyncData({ app, store, params }) {
    let poets = await app.$axios
      .get("/api/libraries_featured_poets", {})
      .then(res => {
        return {
          rows: res.data.rows,
          poetsLink: {
            to: "/poetsorg/poet",
            text: res.data.pager.total_items
          }
        };
      })
      .catch(err => {
        console.log(err);
      });
    let texts = await app.$axios
      .get("/api/texts", {})
      .then(res => {
        return {
          rows: res.data.rows,
          textsLink: {
            to: "/poetsorg/text",
            text: res.data.pager.total_items
          }
        };
      })
      .catch(err => {
        console.log(err);
      });
    let books = await app.$axios
      .get("/api/books", {})
      .then(res => {
        return {
          rows: res.data.rows,
          booksLink: {
            to: "/poetsorg/book",
            text: res.data.pager.total_items
          }
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      poets: poets.rows,
      poetsLink: poets.poetsLink,
      texts: texts.rows,
      textsLink: texts.textsLink,
      books: books.rows,
      booksLink: books.booksLink
    };
  },
  methods: {},
  watchQuery: true
};
</script>

<style scoped lang="scss">
</style>
