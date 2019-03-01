<template>
  <div>
    <CardDeck
      title="Poems"
      class="pt-5 pb-3"
      cardtype="PoemCard"
      cols="4"
      :cards="poems"
      :link="poemsLink"
    />
    <CardDeck
      title="Poets"
      class="pt-5 pb-3"
      cardtype="Poet"
      cols="4"
      :cards="poets"
      :link="poetsLink"
    />
    <CardDeck
      title="Texts"
      class="pt-5 pb-3"
      cardtype="TextCard"
      cols="4"
      :cards="texts"
      :link="textsLink"
    />
    <CardDeck
      title="Books"
      class="pt-5 pb-3"
      cardtype="BookCard"
      cols="3"
      :cards="books"
      :link="booksLink"
    />
  </div>
</template>

<script>
import _ from "lodash";
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
  async fetch({ app, store, params }) {
    store.commit("updateSubNavigation", [
      {
        to: "/libraries",
        text: "Library"
      },
      {
        to: "/poetorg/poems",
        text: "Poems"
      },
      {
        to: "/poetorg/poets",
        text: "Poets"
      },
      {
        to: "/poetsorg/texts",
        text: "Texts"
      },
      {
        to: "/poetsorg/books",
        text: "Books"
      },
      {
        to: "/poetsorg/audio",
        text: "Audio"
      },
      {
        to: "/poetsorg/video",
        text: "Video"
      }
    ]);
  },
  async asyncData({ app, store, params }) {
    let poems = await app.$axios
      .get("/api/libraries_featured_poems", {})
      .then(res => {
        return {
          rows: res.data.rows,
          poemsLink: {
            to: "/poetsorg/poem",
            text: res.data.pager.total_items
          }
        };
      })
      .catch(err => {
        console.log(err);
      });
    let poets = await app.$axios
      .get("/api/node/person", {
        params: {
          filter: {
            status: 1,
            field_p_type: "poet"
          },
          page: {
            limit: 6
          },
          sort: "-field_featured",
          include: "field_image"
        }
      })
      .then(res => {
        return {
          rows: _.map(_.get(res, "data.data"), row => {
            return {
              row,
              name: _.get(row, "attributes.title", null),
              bio:
                _.get(row, "attributes.body.summary", null) ||
                _.get(row, "attributes.body.processed", null),
              img: app.$buildImg(res.data, row, "field_image", "portrait")
            };
          }),
          poetsLink: {
            to: "/poetsorg/poet",
            text: `${res.data.meta.count} Poets`
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
      poems: poems.rows,
      poemsLink: poems.poemsLink,
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
