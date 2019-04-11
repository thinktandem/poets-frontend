<template>
  <b-container class="lesson_plan__container">
    <b-row class="py-5">
      <b-col md="8">
        <div
          class="lesson_plan__body"
          v-if="$store.state.pageData.data.attributes.body"
          v-html="$store.state.pageData.data.attributes.body.processed"/>
        <div
          v-for="(plan, i) in $store.state.sidebarData"
          :key="`plan-${i}`">
          <div
            v-if="plan.type === 'paragraph--standard_text'"
            class="plan__container">
            <div class="plan__title">
              {{ plan.attributes.title }}
            </div>
            <div
              class="plan__body"
              v-html="plan.attributes.body.processed"/>
          </div>
        </div>
      </b-col>
      <b-col
        md="4"
        tag="aside">
        <div v-if="$store.state.pageData.data.attributes.field_table_of_contents">
          <h3>Table of Contents</h3>
          <div
            v-html="$store.state.pageData.data.attributes.field_table_of_contents.processed"/>
        </div>
        <div class="submitted__container">
          <div class="person__submitted">
            <h3>Submitted</h3>
          </div>
          <div class="sidebar__published">
            {{
              niceDate(
                $store.state.pageData.data.attributes.field_date_published
              )
            }}
          </div>
          <div
            v-for="(person, i) in $store.state.sidebarData"
            :key="`person-${i}`">
            <div
              class="sidebar__contributor"
              v-if="person.type == 'node--person'">
              <b-link
                :to="person.attributes.path.alias">
                {{ person.attributes.title }}
              </b-link>
            </div>
          </div>
        </div>
        <div class="level__container">
          <div class="level__header">
            <h3>Level</h3>
          </div>
          <div
            v-for="(level, i) in $store.state.sidebarData"
            :key="`level-${i}`">
            <div
              class="level__level"
              v-if="level.type == 'taxonomy_term--level'">
              {{ level.attributes.name }}
            </div>
          </div>
        </div>
        <div class="type__container">
          <div class="type__header">
            <h3>Type</h3>
          </div>
          <div
            v-for="(type, i) in $store.state.sidebarData"
            :key="`type-${i}`">
            <div
              class="type__type"
              v-if="type.type == 'taxonomy_term--lesson_plan_practice_and_pedagog'">
              {{ type.attributes.name }}
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import _ from "lodash";
import niceDate from "~/plugins/niceDate";

export default {
  layout: "default",
  async fetch({ app, store, route }) {
    return app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
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
      .catch(err => {
        this.$sentry.captureException(err);
        console.log(err);
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
