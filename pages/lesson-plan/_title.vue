<template>
  <app-full-lesson-plan
    :data="$store.state.pageData.data"
    :includes="$store.state.sidebarData"
    :path="path"/>
</template>
<script>
import _ from "lodash";
import niceDate from "~/plugins/niceDate";
import AppFullLessonPlan from "~/components/AppFullLessonPlan";

export default {
  layout: "default",
  components: { AppFullLessonPlan },
  async fetch({ app, store, route }) {
    return app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .catch(err => {
        app.handleError(err);
      })
      .then(routerResponse => {
        return app.$axios
          .$get(routerResponse.jsonapi.individual, {
            params: {
              include:
                "field_lesson_plan_content,field_contributors,field_level,field_type"
            }
          })
          .then(async response => {
            store.commit("updateHero", {
              variant: "default",
              heading: _.get(response, "data.attributes.title"),
              lead: _.get(response, "data.attributes.lead_text")
            });
            // Set the main page data
            store.commit("updatePageData", response);
            store.commit("updateSidebarData", response.included);
            store.commit("updateHighlightedData", []);
            store.commit("updateRelatedContent", []);
            store.commit("updateFeaturedContent", []);
            store.commit("updateExtendedContent", []);
          });
      })
      .catch(error => {
        console.error(error);
      });
  },
  methods: {
    niceDate(date) {
      return niceDate.niceDate(date);
    }
  }
};
</script>
<style scoped lang="scss">
.lesson_plan__container {
  font-size: 1.2rem;
}
.lesson_plan__body {
  font-weight: 400;
}
.plan__title {
  margin-bottom: 26px;
}
.plan__body {
  font-weight: 400;
}
/** sidebar **/
.submitted__container,
.level__container,
.type__container {
  margin: 14px 0 14px 0;
  font-weight: 400;
}
</style>
