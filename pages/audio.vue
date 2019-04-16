<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <card-deck
      cardtype="PoemCard"
      :cards="featuredAudio"/>
    <b-container class="poems-list__filters filters">
      <b-row class="poems-list__filters-row">
        <b-col md="12">
          <app-form
            class="poems-list__search">
            <b-form-group>
              <div class="legend-selects">
                <div class="poems-list__filters__legend">
                  <legend>Filter by</legend>
                </div>
                <b-form-select
                  :disabled="busy"
                  inline
                  @input="searchAudio(0)"
                  v-model="filters.occasion"
                  :options="options.occasions">
                  <template slot="first">
                    <option
                      :value="null"
                      disabled>
                      Occassions</option>
                  </template>
                </b-form-select>
                <b-form-select
                  :disabled="busy"
                  inline
                  @input="searchAudio(0)"
                  v-model="filters.theme"
                  :options="options.themes">
                  <template slot="first">
                    <option
                      :value="null"
                      disabled>
                      Themes</option>
                  </template>
                </b-form-select>
                <b-form-select
                  :disabled="busy"
                  inline
                  @input="searchAudio(0)"
                  v-model="filters.form"
                  :options="options.form">
                  <template slot="first">
                    <option
                      :value="null"
                      disabled>
                      Forms</option>
                  </template>
                </b-form-select>

                <div class="poems-list__input--search">
                  <b-input-group>
                    <b-form-input
                      :disabled="busy"
                      v-model="filters.combine"
                      type="text"
                      size="22"
                      placeholder="Search title or text ..."
                    />
                    <b-input-group-append is-text>
                      <magnifying-glass-icon
                        class="icon mr-2"/>
                    </b-input-group-append>
                  </b-input-group>
                </div>

              </div>
            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>

    <b-container class="poems-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col md="4">
          Name
        </b-col>
        <b-col md="4">
          Author
        </b-col>
        <b-col md="4">
          Year
        </b-col>
      </b-row>
      <b-row
        v-for="audio in audios"
        class="tabular-list__row poems-list__poems"
        :key="audio.id">
        <b-col md="4">
          <b-link
            class="poem__link"
            :to="audio.view_node"
            v-html="audio.title"/>
        </b-col>
        <b-col
          v-html="audio.field_author"
          md="4"/>
        <b-col md="4">
          {{ audio.field_date_published }}
        </b-col>
      </b-row>

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
          align="fill">
          <span slot="prev-text">
            <iconMediaSkipBackwards /> Prev
          </span>
          <span slot="next-text">
            Next <iconMediaSkipForwards />
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
    combine: filters.combine,
    field_form_target_id: filters.form,
    field_occasion_target_id: filters.occasion,
    field_poem_themes_target_id: filters.theme
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
      audios: [],
      busy: true,
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
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    Promise.all([
      this.searchAudio(),
      this.getFilter("occasions"),
      this.getFilter("themes"),
      this.getFilter("form")
    ]);
    // Spin up a debouncing func for text input
    this.debouncedSearchAudio = _.debounce(this.searchAudio, 700);
  },
  methods: {
    getFilter(filter) {
      const fields = "name,drupal_internal__tid";
      const query = _.set({}, `fields[taxonomy_term--${filter}]`, fields);
      this.$api.getTerm(filter, { query }).then(response => {
        this.options[filter] = filterHelpers.map2Options(
          _.get(response, "data.data", [])
        );
      });
    },
    searchAudio(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchAudio({ query }).then(response => {
        console.log(response);
        this.audios = _.get(response, "data.rows", []);
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
      this.searchAudio(queryPage);
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchAudio();
    }
  },
  async asyncData({ app, params, query }) {
    const featureParams = qs.stringify({
      filter: {
        soundcloud: {
          path: "field_soundcloud_embed_code",
          operator: "<>",
          value: ""
        },
        field_featured: 1
      },
      page: {
        limit: 3
      },
      include: "field_author"
    });
    const featured = await app.$axios.$get(`/api/node/poems?${featureParams}`);
    return {
      featuredAudio: _.map(featured.data, poem => ({
        title: _.get(poem, "attributes.title"),
        text:
          _.get(poem, "attributes.body.summary") ||
          _.get(poem, "attributes.body.processed"),
        poet: {
          name: _.get(
            _.find(
              featured.included,
              include =>
                _.get(include, "id") ===
                _.get(
                  _.first(_.get(poem, "relationships.field_author.data")),
                  "id"
                )
            ),
            "attributes.title"
          )
        },
        year: _.get(poem, "attributes.field_date_published").split("-")[0],
        link: _.get(poem, "attributes.path.alias")
      }))
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
.tabular-list__header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
}
.poems-list__poems {
  font-weight: 400;
  a {
    color: $body-color;

    &:hover,
    &:focus,
    &:active {
      text-decoration: underline;
    }
  }
}

.poems-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.poems-list__search {
  margin-top: 2rem;
}

.legend-selects {
  display: flex;
  flex-basis: 100%;
  padding: 1rem 1rem 1rem 2rem;
  border-right: $form__border;

  select {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
}

.poems-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.poems-list__input--search {
  flex-basis: 100%;
  position: relative;

  input {
    border: none;
    background-color: transparent;

    &:hover,
    &:focus,
    &:active {
      border: none;
      background-color: transparent;
    }

    &::placeholder {
      color: $gray-700;
    }
  }

  button {
    width: 2rem;
    height: 2rem;
    display: flex;
    padding: 0;
    justify-content: center;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;

    &:hover,
    &:focus,
    &:active,
    &:active:focus {
      // Some really sticky rules getting applied from BS that need a bit of
      // force.
      background-color: transparent !important;
      box-shadow: none !important;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
.icon {
  display: inline;
  fill: $blue;
  width: 1.4rem;
  height: 1.4rem;
}
.input-group-text {
  background: transparent;
  border: none;
}
</style>
