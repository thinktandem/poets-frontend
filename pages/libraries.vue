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
import qs from "qs";
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
    return app.$buildBasicPage(app, store, "/poetsorg/poems-poets");
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
            field_p_type: "poet",

            image: {
              path: "field_image.id",
              operator: "<>",
              value: ""
            }
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

    const bookParams = qs.stringify({
      filter: {
        field_featured: 1
      },
      page: {
        limit: 4
      },
      include: "field_author,field_image"
    });
    const books = await app.$axios
      .$get(`/api/node/books?${bookParams}`)
      .then(res => {
        return {
          rows: _.map(res.data, book => ({
            title: _.get(book, "attributes.title"),
            body:
              _.get(book, "attributes.body.summary") ||
              _.get(book, "attributes.body.processed"),
            field_image: app.$buildImg(res, book, "field_image", "book"),
            field_author: _.get(
              _.find(
                res.included,
                include =>
                  _.get(include, "id") ===
                  _.get(
                    _.first(_.get(book, "relationships.field_author.data")),
                    "id"
                  )
              ),
              "attributes.title"
            ),
            view_node_1: _.get(book, "attributes.path.alias")
          })),
          booksLink: {
            to: "/poetsorg/books",
            text: res.meta.count + " books"
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
