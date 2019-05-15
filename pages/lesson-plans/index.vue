<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"
    />
    <div class="bg-white">
      <b-container class="py-5">
        <b-row>
          <b-col md="12">
            <h2 class="mb-5">Featured Lesson Plans</h2>
            <lesson-plan-card v-bind="latestPlan" />
          </b-col>
        </b-row>
      </b-container>
      <card-deck
        cols="6"
        cardtype="LessonPlanCard"
        :cards="featuredLessons.cards"
      />
    </div>

    <b-container>
      <b-row>
        <b-col md="12">
          <app-form>
            <b-form-group class="table-filters table-filters--search-only">
              <div class="table-filters__search">
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
                    <iconSearch class="icon" />
                  </b-input-group-append>
                  <b-button
                    class="reset-button"
                    size="sm"
                    type="link"
                    variant="outlined-primary"
                    href="/lesson-plans">
                    Reset
                  </b-button>
                </b-input-group>
              </div>
            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>

    <b-container>
      <b-table
        id="lesson-plans"
        :items="plans"
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
            v-html="replaceFileUrl(data.item.title)"
          />
        </template>
      </b-table>
      <div class="pager">
        <b-pagination
          @input="paginate"
          :disabled="busy"
          aria-controls="lesson-plans"
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
import BasicPage from "~/components/BasicPage";
import CardDeck from "~/components/CardDeck";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import iconSearch from "~/static/icons/magnifying-glass.svg";
import LessonPlanCard from "~/components/LessonPlanCard";
import MetaTags from "~/plugins/metatags";

// Helper to build out query
const buildQuery = (filters = {}) =>
  _.pickBy({
    combine: filters.combine
  });

export default {
  components: {
    BasicPage,
    CardDeck,
    iconMediaSkipBackwards,
    iconMediaSkipForwards,
    iconSearch,
    LessonPlanCard
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
          key: "field_level",
          label: "Level"
        },
        {
          key: "field_type",
          label: "Type"
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
      plans: [],
      rows: 0
    };
  },
  mounted() {
    // Get all the data we need for search
    Promise.all([this.searchLessonPlans()]);
    // Spin up a debouncing func for text input
    this.debouncedSearchLessonPlans = _.debounce(this.searchLessonPlans, 700);
  },
  methods: {
    searchLessonPlans(page = 0) {
      this.busy = true;
      const query = _.merge({}, buildQuery(this.filters), { page });
      this.$api.searchLessonPlans({ query }).then(response => {
        this.plans = _.get(response, "data.rows", []);
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
      this.searchLessonPlans(queryPage);
    }
  },
  watch: {
    "filters.combine": function() {
      this.debouncedSearchLessonPlans();
    }
  },
  async asyncData({ app, params, query }) {
    // Get the latest lesson
    const latestLessonParams = qs.stringify({
      filter: {
        status: 1
      },
      page: {
        limit: 1
      },
      sort: "-changed",
      include: "field_level,field_contributors"
    });
    const latestPlan = await app.$axios
      .$get(`/api/node/lesson_plans?${latestLessonParams}`)
      .then(res => {
        const plan = _.first(_.get(res, "data"));
        return {
          res,
          plan,
          component: "LessonPlanCard",
          title: _.get(plan, "attributes.title"),
          level: _.get(
            app.$getRelated(res, plan, "field_level"),
            "attributes.name"
          ),
          body:
            _.get(plan, "attributes.body.summary") ||
            _.get(plan, "attributes.body.processed"),
          link: _.get(plan, "attributes.path.alias"),
          id: _.get(plan, "id", 0)
        };
      })
      .catch(err => console.log(err));
    const featureParams = qs.stringify({
      filter: {
        field_featured: {
          path: "field_featured",
          operator: "=",
          value: 1
        },
        status: 1,
        id: {
          path: "id",
          operator: "<>",
          value: _.get(latestPlan, "id")
        }
      },
      page: {
        limit: 4
      },
      include: "field_contributors,field_level"
    });
    const featured = await app.$axios.$get(
      `/api/node/lesson_plans?${featureParams}`
    );
    return _.merge(
      {},
      {
        latestPlan,
        featuredLessons: {
          response: featured,
          cards: _.map(featured.data, lesson => ({
            title: _.get(lesson, "attributes.title"),
            body:
              _.get(lesson, "attributes.body.summary") ||
              _.get(lesson, "attributes.body.processed"),
            link: _.get(lesson, "attributes.path.alias"),
            level: _.get(
              app.$getRelated(featured, lesson, "field_level"),
              "attributes.name"
            )
          }))
        }
      }
    );
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path).then(async () => {});
  }
};
</script>

<style scoped lang="scss">
.reset-button {
  position: relative;
  top: 5px;
  left: 22px;
}
</style>
