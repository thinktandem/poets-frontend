
<template>
  <b-card
    class="card--lesson-plan"
    tag="article"
    no-body
  >
    <b-card-body class="d-flex justify-content-between flex-column align-content-between">
      <h3 class="card-title">
        <b-link
          class="text-dark"
          :to="link"
          itemprop="title"
        >
          {{ title }}
        </b-link>
      </h3>
      <app-teaser-text
        class="card-body"
        :text="replaceFileUrl(body)"/>
      <div
        class="card-footer">
        <app-teaser-text
          class="card--lesson-plan__meta"
          :text="meta"
          :length="100"/>
        <p class="card--lesson-plan__level">{{ level }}</p>
      </div>
    </b-card-body>
  </b-card>
</template>
<script>
import AppTeaserText from "~/components/AppTeaserText";
export default {
  components: { AppTeaserText },
  props: {
    title: {
      type: String,
      default: ""
    },
    body: {
      type: String,
      default: ""
    },
    level: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss">
.card--lesson-plan {
  border-color: var(--blue);
}
.card--lesson-plan__meta {
  font-size: $font-size-base;
  font-weight: $font-weight-base;
  line-height: 1.75;
}
.card-footer {
  p {
    &.card--lesson-plan__level {
      font-weight: 400;
      font-size: $font-size-base;
      line-height: 1;
    }
  }
}
</style>
