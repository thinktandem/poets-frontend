<template>
  <div>
    <b-container
      class="py-5"
      v-if="movement">
      <h2 class="h3">{{ movement.title }}</h2>
      <div v-html="movement.body"/>
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
// import { stringify } from "qs";
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
    school: filters.school,
    state: filters.state
  });

// Helper to param stringify the filters
// const buildParams = (filters = {}) => stringify(_.pickBy(filters));

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

// Helper to fetch a specific term
const buildTermQuery = id => ({
  filter: {
    drupal_internal__tid: id,
    status: 1
  },
  page: {
    limit: 1
  }
});

// Build the url parameter based query string.
const buildUrlParamQuery = id => ({
  filter: {
    name: _.upperFirst(id),
    status: 1
  }
});

export default {
  components: {
    CardDeck,
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    MagnifyingGlassIcon
  },
  head() {
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
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
      urlFilter: "",
      page: 1,
      pageCache: [],
      perPage: 20,
      poets: [],
      term: {},
      rows: 0
    };
  },
  async created() {
    const termIdQuery = buildUrlParamQuery(this.$route.params.term);
    await this.$api
      .getTermId(
        "school_movement", // this.$route.params.filter,
        this.$route.params.term,
        termIdQuery
      )
      .then(res => {
        this.urlFilter = res;
        return res;
      });

    const getFilter = this.getUrlFilter(this.$route.params.filter);
    let termFilter = {};
    termFilter[getFilter] = this.urlFilter;
    this.filters = _.merge(this.filters, termFilter);
  },
  mounted() {
    // the placeholders show up in the dropdowns
    this.filters = _.merge(this.filters, this.$route.query);
    Promise.all([this.getSchools(), this.getStates()]);
    // Spin up a debouncing func for text input
    this.debouncedSearchPoets = _.debounce(this.searchPoets, 700);
  },
  methods: {
    searchPoets(page = 0) {
      this.busy = true;

      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchPoets({ query }).then(response => {
        this.page = _.get(response, "data.pager.current_page", 1) + 1;
        this.rows = _.get(response, "data.pager.total_items", 0);
        this.poets = this.rows > 0 ? _.get(response, "data.rows", []) : [];
        this.busy = false;
      });
      // Grab the movement.
      Promise.all([this.getMovement()]);
      let pageString =
        `/poets/` +
        `${this.$route.params.filter}/` +
        `${this.$route.params.term}` +
        `?page=${query.page}`;
      if (query.combine || query.state || query.school || query.page !== 0) {
        if (!_.isEmpty(query.combine)) {
          pageString += `&combine=${query.combine}`;
        }
        if (query.state) {
          pageString += `&state=${query.state}`;
        }
        if (query.school) {
          pageString += `&school=${query.school}`;
        }
        this.$ga.page(pageString);
      }
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
    getTermDescription() {
      const priorityTerm = getPriorityTerm(this.filters);
      if (!_.isEmpty(priorityTerm)) {
        this.$api
          .getTerm(priorityTerm.name, {
            query: buildTermQuery(priorityTerm.id)
          })
          .then(response => {
            const first = _.first(_.get(response, "data.data", []));
            this.term = {
              title: _.get(first, "attributes.name"),
              body:
                _.get(first, "attributes.description.summary") ||
                _.get(first, "attributes.description.processed")
            };
          });
      }
    },
    getTermId(filter, term) {
      const termIdQuery = buildUrlParamQuery(this.$route.params.term);
      this.$api.getTermId(filter, term, termIdQuery).then(res => {
        this.urlFilter = res;
        return res;
      });
    },
    getUrlFilter(filter) {
      if (
        filter === "school" ||
        filter === "movements" ||
        filter === "schools"
      ) {
        return "school";
      } else if (filter === "state") {
        return "state";
      }
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
      this.searchPoems(queryPage);
      if (queryPage === 0) {
        this.$ga.page(`/poems?page=0`);
      }
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchPoets();
    }
  },
  async fetch({ app, store, query, route }) {
    return app.$buildBasicPage(app, store, "/poems");
  }
};
</script>

<style scoped lang="scss">
</style>
