<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"
    />
    <card-deck
      cardtype="BookCard"
      :cards="featuredBooks"
    />
    <b-container>
      <b-row>
        <b-col md="12">
          <app-form>
            <b-form-group class="table-filters">
              <div>
                <legend>Filter by</legend>
              </div>
              <b-form-select
                :disabled="busy"
                inline
                @input="searchBooks(0)"
                v-model="filters.type"
                :options="options.types"
              >
                <template slot="first">
                  <option
                    :value="null"
                    disabled
                  >
                    Type</option>
                </template>
              </b-form-select>
              <div class="table-filters__search">
                <b-input-group>
                  <b-form-input
                    v-model="filters.combine"
                    type="text"
                    size="22"
                    placeholder="Search title or text ..."
                  />
                  <b-input-group-append class="icon--search">
                    <b-btn
                      type="submit"
                      variant="transparent"
                    >
                      <magnifying-glass-icon class="icon" />
                    </b-btn>
                  </b-input-group-append>
                </b-input-group>
              </div>
            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="table-container">
      <b-table
        id="books"
        :items="books"
        :fields="fields"
        stacked="md"
        :per-page="perPage"
      >
        <template
          slot="title"
          slot-scope="data"
        >
          <a
            :href="data.item.view_node"
            v-html="replaceFileUrl(data.item.title)"
          />
        </template>
      </b-table>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="books"
          class="pagination"
          hide-goto-end-buttons
          :per-page="perPage"
          size="lg"
          :total-rows="rows"
          v-model="page"
          align="fill"
        >
          <span slot="prev-text">
            <iconMediaSkipBackwards /> Prev
          </span>
          <span slot="next-text">
            Next
            <iconMediaSkipForwards />
          </span>
        </b-pagination>
      </div>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import qs from "qs";
import filterHelpers from "~/plugins/filter-helpers";
import BasicPage from "~/components/BasicPage";
import CardDeck from "~/components/CardDeck";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import MetaTags from "~/plugins/metatags";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    type: filters.type,
    combine: filters.combine
  });

export default {
  components: {
    BasicPage,
    CardDeck,
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    MagnifyingGlassIcon
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      books: [],
      busy: true,
      fields: [
        {
          key: "title",
          label: "Title"
        },
        {
          key: "field_author",
          label: "Author"
        },
        {
          key: "field_booktype",
          label: "Type"
        },
        {
          key: "field_date_published",
          label: "Year"
        }
      ],
      filters: {
        combine: null,
        type: null
      },
      options: {
        types: []
      },
      page: 1,
      pageCache: [],
      perPage: 20,
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    Promise.all([this.searchBooks(), this.getTypes()]);
    // Spin up a debouncing func for text input
    this.debouncedSearchBooks = _.debounce(this.searchBooks, 700);
  },
  methods: {
    getTypes() {
      const fields = "name,drupal_internal__tid";
      const query = _.set({}, "fields[taxonomy_term--book_type]", fields);
      this.$api.getTerm("book_type", { query }).then(response => {
        this.options.types = filterHelpers.map2Options(
          _.get(response, "data.data", [])
        );
      });
    },
    searchBooks(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchBooks({ query }).then(response => {
        console.log(response);
        this.books = _.get(response, "data.rows", []);
        this.page = _.get(response, "data.pager.current_page", 1) + 1;
        this.rows = _.get(response, "data.pager.total_items", 0);
        this.busy = false;
      });
    },
    paginate() {
      this.busy = true;
      // @NOTE: drupal starts at page 0, bPagination starts at 1
      // https://en.wikipedia.org/wiki/Off-by-one_error
      const queryPage = this.page - 1;
      this.searchBooks(queryPage);
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchBooks();
    }
  },
  async asyncData({ app, params, query }) {
    // @TODO: get featured books into the v2 of the api
    const featureParams = qs.stringify({
      filter: {
        field_featured: 1
      },
      page: {
        limit: 3
      },
      include: "field_author,field_image"
    });
    const featured = await app.$axios.$get(`/api/node/books?${featureParams}`);
    return {
      featuredBooks: _.map(featured.data, book => ({
        title: _.get(book, "attributes.title"),
        body:
          _.get(book, "attributes.body.summary") ||
          _.get(book, "attributes.body.processed"),
        field_image: app.$buildImg(featured, book, "field_image", "book"),
        field_author: _.get(
          _.find(
            featured.included,
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
      }))
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, "/books");
  }
};
</script>

<style scoped lang="scss">
</style>
