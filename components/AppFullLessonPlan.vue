<template lang="html">
  <b-container class="lesson_plan__container">
    <b-row class="py-5">
      <b-col md="8">
        <div
          class="lesson_plan__body"
          v-if="data.attributes.body"
          v-html="replaceFileUrl(data.attributes.body.processed)"/>
        <div
          v-for="(plan, i) in includes"
          :key="`plan-${i}`"
          :id="`plan-${i}`">
          <div
            v-if="plan.type === 'paragraph--standard_text'"
            class="plan__container">
            <div class="plan__title">
              <h3>
                {{ plan.attributes.title }}
              </h3>
            </div>
            <div
              class="plan__body"
              v-html="replaceFileUrl(plan.attributes.body.processed)"/>
          </div>
        </div>
      </b-col>
      <b-col
        v-if="showSidebar"
        class="lesson_plan__sidebar"
        md="4"
        tag="aside">
        <div v-if="sidebarExists">
          <h3>Table of Contents</h3>
          <div class="item-list">
            <ul>
              <li
                v-if="plan.type === 'paragraph--standard_text'"
                v-for="(plan, i) in includes"
                :key="`plan-${i}`">
                <b-link :href="`${$route.path}#plan-${i}`">
                  {{ plan.attributes.title }}
                </b-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="submitted__container">
          <div class="person__submitted">
            <h3>Submitted</h3>
          </div>
          <div class="sidebar__published">
            {{
              niceDate(
                data.attributes.field_date_published
              )
            }}
          </div>
          <div
            v-for="(person, i) in includes"
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
            v-for="(level, i) in includes"
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
            v-for="(type, i) in includes"
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
import niceDate from "~/plugins/niceDate";
import _ from "lodash";
export default {
  name: "AppFullLessonPlan",
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    includes: {
      type: Array,
      default: () => []
    },
    showSidebar: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    niceDate(date) {
      return niceDate.niceDate(date);
    }
  },
  computed: {
    sidebarExists() {
      return _.isArrayLike(this.includes);
    }
  }
};
</script>

<style lang="css" scoped>
.lesson_plan__body {
  font-weight: 400;
  font-size: 1.2rem;
}
.plan__title {
  margin-bottom: 26px;
}
.plan__container {
  font-weight: 400;
  font-size: 1.2rem;
}
.lesson_plan__sidebar {
  padding-left: 26px;
}
</style>
