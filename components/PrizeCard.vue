<template>
  <b-card
    class="card--prize"
    tag="article"
    no-body
  >
    <b-card-body class="d-flex justify-content-between flex-column align-content-between">
      <h3 class="card-title">
        <b-link
          class="text-color"
          :to="titleLink"
          itemprop="title"
        >
          {{ title }}
        </b-link>
      </h3>
      <div class="card-footer">
        <app-teaser-text
          class="card--prize__meta"
          :text="body"/>
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
    titleLink: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss">
.card--prize {
  border-color: var(--orange);
}
.card--prize__meta {
  font-size: $font-size-base;
  font-weight: 400;
  line-height: 1.75;
}
.card-footer {
  margin-top: 0;
  padding-top: 0;

  p {
    font-weight: 300;
    font-size: $font-size-base;
    line-height: 1;
  }
}
</style>
