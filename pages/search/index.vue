<template>
  <div>
    <b-container>
      <h1>Search Results</h1>
      <b-row>
        <b-col md="12">
          <app-form>
            <b-form-group>
              <div>
                <div>
                  <b-input-group>
                    <b-form-input
                      :disabled="busy"
                      v-model="filters.combine"
                      type="text"
                      size="22"
                      placeholder="Search title or text ..."
                    />
                    <b-input-group-append is-text>
                      <magnifying-glass-icon class="icon mr-2" />
                    </b-input-group-append>
                  </b-input-group>
                </div>
              </div>
            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>

    <b-container v-if="count === 0">
      Your search didn't turn up any results.
    </b-container>
    <b-container v-else>
      <b-table
        id="results"
        :items="results"
        :fields="fields"
        stacked="md"
        :per-page="perPage"
      >
        <template
          slot="title"
          slot-scope="data"
        >
          <a
            :href="data.item.link"
            v-html="data.item.title"
          />
        </template>
        <template
          slot="body"
          slot-scope="data"
        >
          <div v-html="data.item.body" />
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
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MagnifyingGlassIcon from "~/node_modules/open-iconic/svg/magnifying-glass.svg";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    combine: filters.combine
  });

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    MagnifyingGlassIcon
  },
  data() {
    return {
      busy: true,
      count: 0,
      fields: [
        {
          key: "title",
          label: "Title"
        },
        {
          key: "body",
          label: "Summary"
        }
      ],
      filters: {
        combine: null
      },
      page: 1,
      pageCache: [],
      perPage: 10,
      results: [],
      rows: 0
    };
  },
  mounted() {
    // Merge in any queries
    this.filters = this.$route.query;
    // Get all the data we need for search
    Promise.all([this.search()]);
    // Spin up a debouncing func for text input
    this.debouncedSearch = _.debounce(this.search, 700);
  },
  methods: {
    search(page = 0) {
      this.busy = true;
      this.results = [];
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.search({ query }).then(response => {
        this.results = _.get(response, "data.data", []);
        this.count = _.size(this.results);
        this.rows = _.get(response, "data.total_rows", 0);
        this.busy = false;
      });
    },
    paginate() {
      this.busy = true;
      // @NOTE: drupal starts at page 0, bPagination starts at 1
      // https://en.wikipedia.org/wiki/Off-by-one_error
      const queryPage = this.page - 1;
      this.search(queryPage);
    }
  },
  watch: {
    "$route.query": function() {
      this.filters = this.$route.query;
    },
    "filters.combine": function() {
      this.debouncedSearch();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
