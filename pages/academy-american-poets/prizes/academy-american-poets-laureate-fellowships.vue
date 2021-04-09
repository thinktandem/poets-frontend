<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="12">
          <h1>{{ prize.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="replaceFileUrl(prize.body)"
          class="prizes__body"
          md="8"/>
        <b-col md="4">
          <b-img-lazy
            :src="prize.image.src"
            :alt="prize.image.alt"
            fluid
            center/>
        </b-col>
      </b-row>
    </b-container>
    <b-container
      class="lpi-list">
      <app-form>
        <b-form-group class="table-filters">
          <div>
            <legend>Filter by</legend>
          </div>
          <b-form-select
            :disabled="busy"
            inline
            @input="searchProjects(0)"
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
            @input="searchProjects(0)"
            v-model="filters.year"
            :options="options.years"
          >
            <template slot="first">
              <option
                :value="null"
              >
                Year</option>
            </template>
          </b-form-select>
        </b-form-group>
      </app-form>
      <div
        class="laureate-project-list"
        v-for="sp in projects"
        :key="sp.title">
        <app-laureate-projects
          class="lpi-list-item"
          v-if="sp.title"
          title=""
          :features="sp"
          :base="base" />
      </div>
    </b-container>
    <b-container>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="projects"
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
import AppLaureateProjects from "~/components/AppLaureateProjects";
import filterHelpers from "~/plugins/filter-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";
import MetaTags from "~/plugins/metatags";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    state: filters.state,
    year: filters.year
  });
// Helper to param stringify the filters
const buildParams = (filters = {}) => stringify(_.pickBy(filters));

export default {
  head() {
    return MetaTags.renderTags(this.$route, this.prize.tags);
  },
  components: {
    AppLaureateProjects,
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    MagnifyingGlassIcon
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
          key: "field_year",
          label: "Year"
        }
      ],
      filters: {
        state: null,
        year: null
      },
      options: {
        states: [],
        years: []
      },
      page: 1,
      pageCache: [],
      perPage: 10,
      projects: [],
      rows: 0,
      base: ""
    };
  },
  async asyncData({ app, route, error }) {
    const routerResponse = await app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .catch(err => {
        error({ statusCode: 404, message: "" });
      });
    const prize = await app.$axios.$get(
      routerResponse.jsonapi.individual + "?include=field_image"
    );
    // const subPrize = await app.$axios.$get(`/api/laureate_projects`);
    const base = app.$axios.defaults.baseURL;

    return {
      prize: {
        title: _.get(prize, "data.attributes.title"),
        body: _.get(prize, "data.attributes.body.processed"),
        image: app.$buildImg(prize, null, "field_image", "media_aside_lg"),
        tags: _.get(prize, "data.attributes.metatag_normalized")
      },
      base
    };
  },
  async fetch({ store }) {
    store.commit("updateHero", {
      heading: "Prizes"
    });
  },
  methods: {
    searchProjects(page = 0) {
      this.busy = true;
      const filters = {
        state: this.filters.state,
        year: {
          min: Date.parse(`01 January ${this.filters.year}`) / 1000,
          max: Date.parse(`31 December ${this.filters.year}`) / 1000
        }
      };
      const query = _.merge({}, buildQuery(filters), { page });
      // Get the updated list of poets
      this.$api.searchProjects({ query }).then(response => {
        this.page = _.get(response, "data.pager.current_page", 1) + 1;
        this.rows = _.get(response, "data.pager.total_items", 0);
        this.projects = this.rows > 0 ? _.get(response, "data.rows", []) : [];
        let years = [];
        years["2019"] = "2019";
        years["2020"] = "2020";
        years["2021"] = "2021";
        this.options.years = years;
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
      // Grab the state and year
      Promise.all([this.getStates()]);
      if (query.year || query.state || query.page !== 0) {
        let pageString = `/api/laureate_projects?page=${query.page}`;
        if (query.state) {
          pageString += `&state=${query.state}`;
        }
        if (query.year) {
          pageString += `&year${query.year}`;
        }
        this.$ga.page(pageString);
      }
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
      this.busy = false;
    },
    paginate() {
      this.busy = true;
      // @NOTE: drupal starts at page 0, bPagination starts at 1
      // https://en.wikipedia.org/wiki/Off-by-one_error
      const queryPage = this.page - 1;
      this.searchProjects(queryPage);
      if (queryPage === 0) {
        this.$ga.page(
          `/academy-american-poets/prizes/academy-american-poets-laureate-fellowships?page=0`
        );
      }
    }
  },
  mounted() {
    // the placeholders show up in the dropdowns
    this.filters = _.merge(this.filters, this.$route.query);
    Promise.all([this.searchProjects(0), this.getStates()]);
  }
};
</script>

<style scoped lang="scss">
.prizes__body {
  font-weight: 400;
}
.lpi-list {
  padding: 0.4rem;
  background-color: #f1f1f1;
}
#laureate-component {
  margin-bottom: 5rem;
}
.lpi-list-item {
  min-height: 256px;
}
</style>
