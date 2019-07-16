<template>
  <app-full-lesson-plan
    :data="$store.state.pageData.data"
    :includes="$store.state.sidebarData"
    :path="path"/>
</template>
<script>
import _ from "lodash";
import niceDate from "~/plugins/niceDate";
import MetaTags from "~/plugins/metatags";
import AppFullLessonPlan from "~/components/AppFullLessonPlan";

export default {
  layout: "default",
  components: { AppFullLessonPlan },
  head() {
    return MetaTags.renderTags(
      this.$route,
      this.$store.state.pageData.data.attributes.metatag_normalized
    );
  },
  async fetch({ app, store, route, error }) {
    return app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .catch(err => {
        error({ statusCode: 404, message: "" });
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
/** sidebar **/
.submitted__container,
.level__container,
.type__container {
  margin: 14px 0 14px 0;
  font-weight: 400;
}
</style>
