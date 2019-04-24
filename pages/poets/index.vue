<template>
  <div>
    <b-container
      class="py-5"
      v-if="movement">
      <h2 class="h3">{{ movement.title }}</h2>
      <div v-html="movement.body"/>
      <CardDeck
        title=""
        cardtype="Poet"
        :cards="featuredPoets"
      />
    </b-container>
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
                @input="searchPoets(0)"
                v-model="filters.state"
                :options="options.states"
              >
                <template slot="first">
                  <option
                    :value="null"
                    disabled
                  >
                    State</option>
                </template>
              </b-form-select>
              <b-form-select
                :disabled="busy"
                inline
                @input="searchPoets(0)"
                v-model="filters.school"
                :options="options.schools"
              >
                <template slot="first">
                  <option
                    :value="null"
                    disabled
                  >
                    Schools & Movements</option>
                </template>
              </b-form-select>

              <div class="table-filters__search">
                <b-input-group>
                  <b-form-input
                    :disabled="busy"
                    v-model="filters.combine"
                    type="text"
                    size="22"
                    placeholder="Search by poet, movement, etc..."
                  />
                  <b-input-group-append
                    is-text
                    class="icon--search"
                  >
                    <magnifying-glass-icon class="icon" />
                  </b-input-group-append>
                </b-input-group>
              </div>

            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-table
        id="poets"
        :items="poets"
        :fields="fields"
        stacked="md"
        :per-page="perPage"
      >
        <template
          slot="poets"
          slot-scope="data"
        >
          <a
            :href="data.item.view_node"
            v-html="replaceFileUrl(data.item.poets)"
          />
        </template>
        <template
          slot="years"
          slot-scope="data"
        >
          {{ data.item.field_dob }} - {{ data.item.field_dod }}
        </template>
      </b-table>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="poets"
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
import { stringify } from "qs";
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
    school: filters.school,
    state: filters.state
  });

// Helper to param stringify the filters
const buildParams = (filters = {}) => stringify(_.pickBy(filters));

// Helper to fetch a specific movement
const buildMovementQuery = school => ({
  filter: {
    drupal_internal__tid: school,
    status: 1
  },
  page: {
    limit: 1
  }
});

// Helper to fetch featured poets
const buildFeaturesPoetsQuery = ({ school = null, state = null } = {}) => {
  // Spin up the basic query
  const query = {
    filter: {},
    page: {
      limit: 3
    },
    // @NOTE: this is an offhanded way to get results with images at the top
    // because for some reason fitlering to check image existence takes FOREVER
    sort: "-field_featured,-field_image.fid",
    include: "field_image"
  };
  // Add in the movement if we need it
  if (!_.isNil(school)) {
    query.filter.movement = {
      condition: {
        path: "field_school_movement.tid",
        operator: "=",
        value: school
      }
    };
  }
  // Add in the state if we need it
  if (!_.isNil(state)) {
    query.filter.state = {
      condition: {
        path: "field_state.nid",
        operator: "=",
        value: state
      }
    };
  }
  // Return
  return query;
};

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    CardDeck,
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
          key: "poets",
          label: "Poet"
        },
        {
          key: "field_school_movement",
          label: "Schools and Movements"
        },
        {
          key: "years",
          label: "Years"
        }
      ],
      featuredPoets: [],
      filters: {
        combine: null,
        school: null,
        state: null
      },
      movement: {},
      options: {
        schools: [],
        states: []
      },
      page: 1,
      pageCache: [],
      perPage: 20,
      poets: [],
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    // NOTE: We need to start with our "null" defualts to make sure
    // the placeholders show up in the dropdowns
    this.filters = _.merge(this.filters, this.$route.query);
    // Run the initial search
    Promise.all([this.searchPoets(), this.getSchools(), this.getStates()]);
    // Spin up a debouncing func for text input
    this.debouncedSearchPoets = _.debounce(this.searchPoets, 700);
  },
  methods: {
    searchPoets(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      // Get the updated list of poets
      this.$api.searchPoets({ query }).then(response => {
        this.page = _.get(response, "data.pager.current_page", 1) + 1;
        this.rows = _.get(response, "data.pager.total_items", 0);
        this.poets = this.rows > 0 ? _.get(response, "data.rows", []) : [];
        // Update the url so the search can be shared.
        // @NOTE: we want to use the raw filters not the query which is
        // parsed into things drupal needs
        const params = buildParams(this.filters);
        if (!_.isEmpty(params)) {
          window.history.pushState({}, "", `?${params}`);
        }
        // And finally set busy
        this.busy = false;
      });
      // Grab the movement and featured poets
      Promise.all([this.getMovement(), this.getFeaturedPoets()]);
    },
    getMovement() {
      if (!_.isNil(this.filters.school)) {
        this.$api
          .getTerm("school_movement", {
            query: buildMovementQuery(this.filters.school)
          })
          .then(response => {
            const term = _.first(_.get(response, "data.data", []));
            this.movement = {
              title: _.get(term, "attributes.name"),
              body:
                _.get(term, "attributes.description.summary") ||
                _.get(term, "attributes.description.processed")
            };
          });
      }
    },
    getFeaturedPoets() {
      const query = buildFeaturesPoetsQuery(this.filters);
      this.$api.getPoets({ query }).then(response => {
        this.featuredPoets = _(_.get(response, "data.data"), [])
          .filter(
            row => !_.isEmpty(_.get(row, "relationships.field_image.data", []))
          )
          .map(row => ({
            row,
            name: _.get(row, "attributes.title", null),
            bio:
              _.get(row, "attributes.body.summary", null) ||
              _.get(row, "attributes.body.processed", null),
            img: this.$buildImg(response.data, row, "field_image", "portrait", {
              src: "/images/default-person.png",
              alt: _.get(row, "attributes.title") + " portrait"
            }),
            link: _.get(row, "attributes.path.alias", null)
          }))
          .value();
      });
    },
    getSchools() {
      const fields = "name,drupal_internal__tid";
      const query = _.set({}, "fields[taxonomy_term--school_movement]", fields);
      this.$api.getTerm("school_movement", { query }).then(response => {
        this.options.schools = filterHelpers.map2Options(
          _.get(response, "data.data", [])
        );
      });
    },
    getStates() {
      const fields = "title,drupal_internal__nid";
      const query = _.set({}, "fields[node--state]", fields);
      this.$api.getTerm("state", { query }, "node").then(response => {
        this.options.states = filterHelpers.map2Options(
          _.get(response, "data.data", []),
          "attributes.title",
          "attributes.drupal_internal__nid"
        );
      });
    },
    paginate() {
      this.busy = true;
      // @NOTE: drupal starts at page 0, bPagination starts at 1
      // https://en.wikipedia.org/wiki/Off-by-one_error
      const queryPage = this.page - 1;
      this.searchPoets(queryPage);
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchPoets();
    }
  },
  async fetch({ app, store, params, query }) {
    return app.$buildBasicPage(app, store, "/poets");
  }
};
</script>

<style scoped lang="scss">
.card-deck--poet {
  background: transparent;
}
.table-filters {
  .table-filters__search {
    min-width: 19rem;

    @include media-breakpoint-up(lg) {
      min-width: 21rem;
    }
  }
}
</style>
