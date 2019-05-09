<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <CardDeck
      title="Poems"
      class="pt-5 pb-3"
      cardtype="PoemCard"
      cols="4"
      :cards="featuredPoems"
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
import BasicPage from "~/components/BasicPage";
import MetaTags from "~/plugins/metatags";

// Helper to fetch featured poems
const buildFeaturesPoemsQuery = ({
  occasion = null,
  theme = null,
  form = null
} = {}) => {
  // Spin up the basic query
  const query = {
    filter: {
      status: 1
    },
    page: {
      limit: 3
    },
    sort: "-field_featured",
    include: "field_author"
  };
  // Return
  return query;
};

const bookParams = qs.stringify({
  filter: {
    field_featured: 1
  },
  page: {
    limit: 4
  },
  include: "field_author,field_image"
});

export default {
  components: {
    BasicPage,
    CardDeck
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      busy: true,
      featuredPoems: [],
      poemsLink: {
        to: "/poets",
        text: "0"
      },
      poets: {},
      poetsLink: {
        to: "/poets",
        text: "0"
      },
      texts: {},
      textsLink: {
        to: "/text",
        text: "0"
      },
      books: {},
      booksLink: {
        to: "/book",
        text: "0"
      }
    };
  },
  mounted() {
    Promise.all([
      this.getFeaturedPoems(),
      this.getFeaturedPoets(),
      this.getTexts(),
      this.getBooks()
    ]);
  },
  methods: {
    getBooks() {
      this.$axios
        .get(`/api/node/books?${bookParams}`)
        .then(response => {
          const count = _.get(response, "data.meta.count", 0);
          this.books = _.map(response.data.data, book => ({
            title: _.get(book, "attributes.title"),
            body:
              _.get(book, "attributes.body.summary") ||
              _.get(book, "attributes.body.processed"),
            field_image: this.$buildImg(
              response.data,
              book,
              "field_image",
              "book"
            ),
            field_author: _.get(
              _.find(
                response.included,
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
          }));
          this.booksLink = {
            to: "/books",
            text: `${count} books`
          };
        })
        .catch(error => {
          console.error(error);
        });
    },
    getFeaturedPoems() {
      const query = buildFeaturesPoemsQuery(this.filters);
      this.$api.getPoems({ query }).then(response => {
        this.poemsLink = {
          to: "/poems",
          text: _.get(response, "data.meta.count") + " Poems"
        };
        this.featuredPoems = _(_.get(response, "data.data"))
          .filter(poem => _.has(poem, "relationships.field_author.data[0].id"))
          .map((poem, index) => ({
            aid: poem.relationships.field_author.data[0].id,
            link: poem.attributes.path.alias,
            title: poem.attributes.title,
            text: poem.attributes.body.processed,
            year: poem.attributes.field_copyright_date.split("-")[0],
            poet: {
              // @NOTE: the below assumes the index of the data and included
              // arrays match up
              name: _.get(response, `data.included[${index}].attributes.title`)
            }
          }))
          .value();
      });
    },
    getFeaturedPoets() {
      this.$api
        .getFeaturedPoets({
          query: {
            page: {
              limit: 6
            }
          }
        })
        .then(response => {
          const count = _.get(response, "data.meta.count", 0);
          this.poets = _(_.get(response, "data.data", []))
            .map(row => ({
              name: _.get(row, "attributes.title", ""),
              bio:
                _.get(row, "attributes.body.summary", "") ||
                _.get(row, "attributes.body.processed", ""),
              img: this.$buildImg(
                response.data,
                row,
                "field_image",
                "portrait",
                {
                  src: "/images/default-person.png",
                  alt: _.get(row, "attributes.title") + " portrait"
                }
              )
            }))
            .value();
          this.poetsLink = {
            to: "/poets",
            text: `${count} Poets`
          };
        })
        .catch(error => {
          console.error(error);
        });
    },
    getTexts() {
      this.$axios
        .get("/api/texts", {})
        .then(response => {
          const count = _.get(response, "data.pager.total_items", 0);
          this.texts = _.get(response, "data.rows", []);
          this.textsLink = {
            to: "/texts",
            text: `${count} Texts`
          };
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
</style>
