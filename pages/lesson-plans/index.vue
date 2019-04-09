<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <div class="bg-white">
      <b-container class="py-5">
        <b-row>
          <b-col md="12">
            <h2 class="mb-5">Featured Lesson Plans</h2>
            <lesson-plan-card
              v-bind="latestPlan"
            />
          </b-col>
        </b-row>
      </b-container>
      <card-deck
        cols="6"
        cardtype="LessonPlanCard"
        :cards="featuredLessons.cards"/>
    </div>
    <b-container class="plans-list__filters filters">
      <b-row class="plans-list__filters-row">
        <b-col md="12">
          <app-form
            class="plans-list__search"
            @submit="applyFilters"
          >
            <b-form-group>
              <div class="legend-selects">
                <div class="plans-list__filters__legend">
                  <legend>Filter by</legend>
                </div>
              </div>
              <div class="plans-list__input--search">
                <b-form-input
                  v-model="combinedInput"
                  type="text"
                  size="22"
                  placeholder="Search title or text ..."
                />
                <b-btn
                  type="submit"
                  class="btn-primary">
                  <iconSearch />
                </b-btn>
              </div>
            </b-form-group>
          </app-form>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="plans-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col md="3">
          Level
        </b-col>
        <b-col md="6">
          Title
        </b-col>
        <b-col md="3">
          Type
        </b-col>
      </b-row>
      <b-row
        v-for="plan in results"
        class="tabular-list__row plans-list__plans"
        :key="plan.id"
      >
        <b-col md="3">
          {{ plan.field_level }}
        </b-col>
        <b-col md="6">
          <b-link
            class="plan__link"
            :to="plan.view_node"
            v-html="plan.title"
          />
        </b-col>
        <b-col
          v-html="plan.field_type"
          md="2"/>
      </b-row>
      <div class="pager">
        <ul
          role="menubar"
          aria-disabled="false"
          aria-label="Pagination"
          class="pagination"
        >
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
            :class="{ disabled: !currentPage}"
          >
            <a
              :href="`/audio?page=${Prev}${preparedCombine}`"
              class="page-link"
            >
              <iconMediaSkipBackwards /> Prev
            </a>
          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              v-if="pageNum + 1 < totalPages"
              :href="`/audio?page=${pageNum + 1}{preparedCombine}`"
              class="page-link"
            >
              {{ pageNum + 1 }}
            </a>

          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              v-if="pageNum + 2 < totalPages"
              :href="`/audio?page=${pageNum + 2}${preparedCombine}`"
              class="page-link"
            >
              {{ pageNum + 2 }}
            </a>
          </li>

          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              v-if="pageNum + 3 < totalPages"
              :href="`/audio?page=${pageNum + 3}${preparedCombine}`"
              class="page-link"
            >
              {{ pageNum + 3 }}
            </a>
          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item ellipsis"
          >
            <span>&hellip;</span>
          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              v-if="pageNum + 1 < totalPages"
              :href="`/audio?page=${totalPages - 1}${preparedCombine}`"
              class="page-link"
            >
              {{ totalPages }}
            </a>
          </li>
          <li
            role="none presentation"
            aria-hidden="true"
            class="page-item"
          >
            <a
              :href="`/audio?page=${Next}${preparedCombine}`"
              class="page-link"
              :class="{disabled: !Next}"
            >
              Next
              <iconMediaSkipForwards />
            </a>

          </li>
        </ul>
      </div>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import qs from "qs";
import BasicPage from "~/components/BasicPage";
import CardDeck from "~/components/CardDeck";
import searchHelpers from "~/plugins/search-helpers";
import iconMediaSkipBackwards from "~/static/icons/media-skip-backwards.svg";
import iconMediaSkipForwards from "~/static/icons/media-skip-forwards.svg";
import iconSearch from "~/static/icons/magnifying-glass.svg";
import LessonPlanCard from "~/components/LessonPlanCard";
import MetaTags from "~/plugins/metatags";

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
      combinedInput: null,
      results: null,
      Next: null,
      Prev: null,
      preparedCombine: null
    };
  },
  async asyncData({ app, params, query }) {
    const url = "/api/lesson_plans";
    const results = await searchHelpers.getSearchResults(url, app, query);
    // Get the latest lesson
    const latestLessonParams = qs.stringify({
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
          meta: _.get(res, "data[0].attributes.body.summary"),
          link: _.get(plan, "attributes.path.alias"),
          id: _.get(res, "data[0].id")
        };
      });
    const featureParams = qs.stringify({
      filter: {
        field_featured: 1,
        status: 1,
        id: {
          operator: "<>",
          value: latestPlan.id
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
    return _.merge(results, {
      latestPlan,
      featuredLessons: {
        response: featured,
        cards: _.map(featured.data, lesson => ({
          title: _.get(lesson, "attributes.title"),
          text:
            _.get(lesson, "attributes.body.summary") ||
            _.get(lesson, "attributes.body.processed"),
          link: _.get(lesson, "attributes.path.alias"),
          level: _.get(
            app.$getRelated(featured, lesson, "field_level"),
            "attributes.name"
          ),
          meta: _.get(featured, "data[0].attributes.body.summary")
        }))
      }
    });
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path).then(async () => {});
  },
  methods: {
    applyFilters() {
      let myQuery = {};
      if (this.combinedInput) {
        myQuery.combine = this.combinedInput;
      }
      this.$router.push({
        name: "vertical-audio",
        query: myQuery
      });
    }
  },
  watchQuery: true
};
</script>

<style scoped lang="scss">
.plans-list__plans {
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
.plans-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.plans-list__search {
  margin-top: 2rem;
}
.plan__link {
  font-weight: 560;
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

.plans-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.plans-list__input--search {
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
