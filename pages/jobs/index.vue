<template>
  <div>
    <BasicPage
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <b-container>
      <b-table
        id="jobs"
        :items="jobs"
        :fields="fields"
        stacked="md"
        :per-page="perPage">
        <template
          slot="title"
          slot-scope="data">
          <a
            :href="data.item.link"
            v-html="replaceFileUrl(data.item.title)"/>
        </template>
        <template
          slot="body"
          slot-scope="data">
          <div v-html="replaceFileUrl(data.item.body)"/>
        </template>
      </b-table>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="jobs"
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
import BasicPage from "~/components/BasicPage";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    BasicPage,
    iconMediaSkipBackwards,
    iconMediaSkipForwards
  },
  head() {
    return MetaTags.renderTags(this.$route, this.$store.state.metatags);
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
          label: "Description"
        }
      ],
      page: 1,
      pageCache: [],
      perPage: 20,
      jobs: [],
      rows: 0
    };
  },
  mounted() {
    Promise.all([this.searchJobs()]);
  },
  methods: {
    searchJobs(page = 0) {
      this.busy = true;
      this.$api.searchJobs({ query: { page } }).then(response => {
        this.jobs = _.get(response, "data.rows", []);
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
      this.searchJobs(queryPage);
    }
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
</style>
