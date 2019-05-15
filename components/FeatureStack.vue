<template>
  <section class="feature-stack">
    <b-container>
      <component
        class="font-serif font-italic"
        :is="titleTag">{{ title }}</component>
      <b-row class="py-3">
        <b-col
          md="12"
          class="d-flex flex-column px-lg-5">
          <app-feature
            v-for="(feature, index) in features"
            :reverse="index % 2 == 1"
            v-bind="feature"
            :key="index"
            class="my-lg-5 my-2 pb-lg-4"
            v-if="features !== null"/>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
import AppFeature from "~/components/AppFeature";
export default {
  name: "FeatureStack",
  components: { AppFeature },
  props: {
    titleTag: {
      type: String,
      default: "h2"
    },
    title: {
      type: String,
      default: ""
    },
    features: {
      type: Array,
      default: null
    }
  }
};
</script>
<style lang="scss" scoped>
.feature-stack {
  background-color: $gray-400;
  padding-top: 2rem;
}
.feature-stack__title {
  font-size: 4.375rem;
  line-height: 0.63;
}

@include media-breakpoint-up(lg) {
  .feature-stack {
    padding-top: 5rem;
    padding-bottom: 7rem;
  }
}
</style>
