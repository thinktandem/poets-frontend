<template>
  <div>
    <CardDeck
      title=""
      class="pt-5 pb-3"
      cardtype="TextCard"
      cols="4"
      :cards="featuredTexts"
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
                @input="searchTexts(0)"
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
                <b-input-group-append class="icon--search">

                  <b-form-input
                    v-model="filters.combine"
                    type="text"
                    size="22"
                    placeholder="Search title or text ..."
                  />
                  <b-btn
                    type="submit"
                    variant="transparent"
                  >
                    <magnifying-glass-icon class="icon" />
                  </b-btn>
                </b-input-group-append>
              </div>

            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-table
        id="text"
        :items="texts"
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
            v-html="data.item.title"
          />
        </template>
      </b-table>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="texts"
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
import filterHelpers from "~/plugins/filter-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import CardDeck from "~/components/CardDeck";
import MetaTags from "~/plugins/metatags";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    combine: filters.combine,
    type: filters.type
  });

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    MagnifyingGlassIcon,
    CardDeck
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      busy: true,
      fields: [
        {
          key: "title",
          label: "Title"
        },
        {
          key: "field_texttype",
          label: "Type"
        },
        {
          key: "field_date_published",
          label: "Date"
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
      texts: [],
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    Promise.all([this.searchTexts(), this.getTypes()]);
    // Spin up a debouncing func for text input
    this.debouncedSearchTexts = _.debounce(this.searchTexts, 700);
  },
  methods: {
    getTypes() {
      const fields = "name,drupal_internal__tid";
      const query = _.set({}, "fields[taxonomy_term--text_type]", fields);
      this.$api.getTerm("text_type", { query }).then(response => {
        this.options.types = filterHelpers.map2Options(
          _.get(response, "data.data", [])
        );
      });
    },
    searchTexts(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchTexts({ query }).then(response => {
        this.texts = _.get(response, "data.rows", []);
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
      this.searchTexts(queryPage);
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchTexts();
    }
  },
  async asyncData({ app, store, params, query }) {
    // @NOTE: this does not fit with the "featured" pattern in /poems or /poets
    const featured = await app.$axios
      .get("/api/texts", {})
      .then(res => {
        return {
          rows: res.data.rows
        };
      })
      .catch(error => {
        console.error(error);
        this.$sentry.captureException(error);
      });

    return {
      featuredTexts: featured.rows
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, "/texts");
  }
};
</script>

<style scoped lang="scss">
</style>
