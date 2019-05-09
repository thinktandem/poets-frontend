<template>
  <div>
    <basic-page
      :page-data="$store.state.pageData"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :extended-content="$store.state.extendedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <b-container class="pt-5">
      <h2>Latest Teach This Poem Lesson Plan</h2>
    </b-container>
    <app-full-lesson-plan
      :data="data"
      :includes="included"
      :show-sidebar="false"/>
    <b-container class="teach-poem__more-lesson-plans-container">
      <h2>Previous Lessons</h2>
      <AppListing
        resource-type="lesson_plans"
        :default-params="defaultParams"
        :includes="includes"
        :fields="fields"
        :details="details"
        :filters="filters"
        :searchable="searchable"/>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import AppListing from "~/components/AppListing";
import AppFullLessonPlan from "~/components/AppFullLessonPlan";
import BasicPage from "~/components/BasicPage";
import iconSearch from "~/static/icons/magnifying-glass.svg";
import MetaTags from "~/plugins/metatags";
import { stringify } from "qs";
export default {
  components: {
    AppListing,
    AppFullLessonPlan,
    BasicPage,
    iconSearch
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      includes: { field_level: "name" },
      fields: {
        title: {
          label: "Name"
        },
        field_date_published: {
          label: "Date"
        }
      },
      details: {},
      defaultParams: {
        filter: {
          status: 1,
          // Teach this poem uuid
          "field_type.id": "fc355e48-c064-42fc-8d89-ad98ec3bb2fb"
        }
      },
      filters: [],
      searchable: [
        { field: "title", label: "name" },
        {
          field: "body.value",
          label: "text"
        }
      ]
    };
  },
  async asyncData({ app }) {
    const params = stringify({
      filter: {
        status: 1,
        // Teach this poem uuid
        "field_type.id": "fc355e48-c064-42fc-8d89-ad98ec3bb2fb"
      },
      include:
        "field_lesson_plan_content,field_contributors,field_level,field_type",
      page: {
        limit: 1
      },
      sort: "-created"
    });
    return app.$axios.$get(`/api/node/lesson_plans?${params}`).then(res => {
      const data = _.first(_.get(res, "data"));
      const included = _.get(res, "included");
      return { res, data, included };
    });
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, route.path);
  }
};
</script>

<style scoped lang="scss">
.ttp__title {
  margin-bottom: 26px;
  font-size: 1.7rem;
}
.ttp__body {
  font-weight: 400;
}
.ttp__image {
  max-width: 300px;
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
