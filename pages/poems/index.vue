<template>
  <div>
    <CardDeck
      v-if="featuredPoems"
      col-size="md"
      class="pt-5"
      title="Featured Poems"
      cardtype="PoemCard"
      :cards="featuredPoems"
    />
    <b-container>
      <b-row>
        <b-col md="12">
          <app-form>
            <b-form-group>
              <div>
                <div>
                  <legend>Filter by</legend>
                </div>
                <b-form-select
                  :disabled="busy"
                  inline
                  @input="searchPoems(0)"
                  v-model="filters.occasion"
                  :options="options.occasions"
                >
                  <template slot="first">
                    <option
                      :value="null"
                      disabled
                    >
                      Occassions</option>
                  </template>
                </b-form-select>
                <b-form-select
                  :disabled="busy"
                  inline
                  @input="searchPoems(0)"
                  v-model="filters.theme"
                  :options="options.themes"
                >
                  <template slot="first">
                    <option
                      :value="null"
                      disabled
                    >
                      Themes</option>
                  </template>
                </b-form-select>
                <b-form-select
                  :disabled="busy"
                  inline
                  @input="searchPoems(0)"
                  v-model="filters.form"
                  :options="options.form"
                >
                  <template slot="first">
                    <option
                      :value="null"
                      disabled
                    >
                      Forms</option>
                  </template>
                </b-form-select>

                <div>
                  <b-input-group>
                    <b-form-input
                      :disabled="busy"
                      v-model="filters.combine"
                      type="text"
                      size="22"
                      placeholder="Search title or text ..."
                    />
                    <b-input-group-append
                      is-text
                      class="icon--search"
                    >
                      <magnifying-glass-icon class="icon" />
                    </b-input-group-append>
                  </b-input-group>
                </div>

              </div>
            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>

    <b-container>
      <b-table
        id="poems"
        :items="poems"
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
          aria-controls="poems"
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
import CardDeck from "~/components/CardDeck";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import MetaTags from "~/plugins/metatags";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    combine: filters.combine,
    field_form_target_id: filters.form,
    field_occasion_target_id: filters.occasion,
    field_poem_themes_target_id: filters.theme
  });

export default {
  components: {
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
          key: "field_date_published",
          label: "Year"
        }
      ],
      filters: {
        combine: null,
        form: null,
        occasion: null,
        theme: null
      },
      options: {
        occasions: [],
        themes: [],
        form: []
      },
      page: 1,
      pageCache: [],
      perPage: 20,
      poems: [],
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    Promise.all([
      this.searchPoems(),
      this.getFilter("occasions"),
      this.getFilter("themes"),
      this.getFilter("form")
    ]);
    // Spin up a debouncing func for text input
    this.debouncedSearchPoems = _.debounce(this.searchPoems, 700);
  },
  methods: {
    searchPoems(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchPoems({ query }).then(response => {
        this.poems = _.get(response, "data.rows", []);
        this.page = _.get(response, "data.pager.current_page", 1) + 1;
        this.rows = _.get(response, "data.pager.total_items", 0);
        this.busy = false;
      });
    },
    getFilter(filter) {
      const fields = "name,drupal_internal__tid";
      const query = _.set({}, `fields[taxonomy_term--${filter}]`, fields);
      this.$api.getTerm(filter, { query }).then(response => {
        this.options[filter] = filterHelpers.map2Options(
          _.get(response, "data.data", [])
        );
      });
    },
    paginate() {
      this.busy = true;
      // @NOTE: drupal starts at page 0, bPagination starts at 1
      // https://en.wikipedia.org/wiki/Off-by-one_error
      const queryPage = this.page - 1;
      this.searchPoems(queryPage);
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchPoems();
    }
  },
  async asyncData({ app, params, query, route }) {
    // @TODO: get this into API v2 plugin
    const featuredPoemsParams = qs.stringify({
      page: {
        limit: 3
      },
      filter: {
        status: 1
      },
      sort: "-field_featured"
    });
    const featuredPoems = await app.$axios.$get(
      `/api/node/poems?${featuredPoemsParams}&include=field_author`
    );
    return {
      featuredPoems: _.map(featuredPoems.data, poem => {
        const poemAuthorId = _.get(
          poem,
          "relationships.field_author.data[0].id"
        );
        let author = "";
        _.each(featuredPoems.included, (inc, i) => {
          if (inc.id === poemAuthorId) {
            author = inc.attributes.title;
          }
        });
        return {
          link: poem.attributes.path.alias,
          title: poem.attributes.title,
          text: poem.attributes.body.processed,
          year: poem.attributes.field_copyright_date.split("-")[0],
          poet: {
            name: author
          }
        };
      })
    };
  },
  async fetch({ app, store, query, route }) {
    return app.$buildBasicPage(app, store, "/poems");
  }
};
</script>

<style scoped lang="scss">
</style>
