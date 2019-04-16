<template>
  <div>
    <CardDeck
      title=""
      class="pt-5 pb-3"
      cardtype="TextCard"
      cols="4"
      :cards="featuredTexts"/>
    <b-container class="texts-list__filters filters">
      <b-row class="texts-list__filters-row">
        <b-col md="12">
          <app-form
            class="texts-list__search">
            <b-form-group>
              <div class="legend-selects">
                <div class="texts-list__filters__legend">
                  <legend>Filter by</legend>
                </div>
                <b-form-select
                  :disabled="busy"
                  inline
                  @input="searchTexts(0)"
                  v-model="filters.type"
                  :options="options.types">
                  <template slot="first">
                    <option
                      :value="null"
                      disabled>
                      Type</option>
                  </template>
                </b-form-select>
              </div>

              <div class="texts-list__input--search">
                <b-form-input
                  v-model="filters.combine"
                  type="text"
                  size="22"
                  placeholder="Search title or text ..."/>
                <b-btn
                  class="btn-primary"
                  type="submit">
                  <iconSearch />
                </b-btn>
              </div>

            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="texts-list tabular-list">
      <b-row
        class="tabular-list__row tabular-list__header"
        id="texts">
        <b-col
          md="3">
          Date
        </b-col>
        <b-col md="6">
          Title
        </b-col>
        <b-col md="3">
          Type
        </b-col>
      </b-row>
      <b-row
        v-for="text in texts"
        class="tabular-list__row texts-list__texts"
        :key="text.title">
        <b-col
          class="date"
          md="3">
          {{ text.field_date_published }}
        </b-col>
        <b-col
          class="texts-list__texts-title"
          md="6">
          <a
            :href="text.view_node"
            v-html="text.title"/>
        </b-col>
        <b-col md="3">
          {{ text.field_texttype }}
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
import filterHelpers from "~/plugins/filter-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import iconSearch from "~/static/icons/magnifying-glass.svg";
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
    iconSearch,
    CardDeck
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      busy: true,
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
      .catch(err => {
        console.log(err);
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
.texts-list__texts {
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
.tabular-list__header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
}
.date {
  color: var(--red-dark);
}
.texts-list__texts-title {
  min-height: 88px;
}
.texts-list__texts-title a {
  color: var(--gray-800);
  font-weight: 560;
}
.texts-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.texts-list__search {
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

.texts-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.texts-list__input--search {
  flex-basis: 100%;
  padding: 1rem;
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
</style>
