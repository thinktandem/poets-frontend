<template>
  <div>
    <BasicPage
      :page-data="$store.state.pageData"
      highlighted=""/>
    <b-container>
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
                      <iconSearch class="icon mr-2"/>
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
        id="press"
        :items="press"
        :fields="fields"
        stacked="md"
        :per-page="perPage">
        <template
          slot="title"
          slot-scope="data">
          <a
            :href="data.item.view_node"
            v-html="data.item.title"/>
        </template>
        <template
          slot="body"
          slot-scope="data">
          <div v-html="data.item.body"/>
        </template>
      </b-table>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="press"
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
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import iconSearch from "~/static/icons/magnifying-glass.svg";
import BasicPage from "~/components/BasicPage";
import MetaTags from "~/plugins/metatags";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    combine: filters.combine
  });

export default {
  components: {
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    iconSearch,
    BasicPage
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
          key: "body",
          label: "Content"
        },
        {
          key: "field_date_published",
          label: "Date"
        }
      ],
      filters: {
        combine: null
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
    Promise.all([this.searchPress()]);
    // Spin up a debouncing func for text input
    this.debouncedSearchPress = _.debounce(this.searchPress, 700);
  },
  methods: {
    searchPress(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchPressCenter({ query }).then(response => {
        this.press = _.get(response, "data.rows", []);
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
      this.searchPress(queryPage);
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchPress();
    }
  },
  async fetch({ app, store, params }) {
    return app.$buildBasicPage(
      app,
      store,
      "/academy-american-poets/press-center"
    );
  }
};
</script>

<style scoped lang="scss">
</style>
