
<template>
  <b-card
    class="card--lesson-plan"
    :title="title"
    tag="article"
    title-tag="h3"
  >
    <span
      class="lesson-plan__name"
      itemprop="title"
    >
      {{ title }}
    </span>
    <div class="card-footer">
      <p class="card--lesson-plan__meta">{{ meta }}</p>
      <p class="card--lesson-plan__level">{{ level }}</p>
    </div>
  </b-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    meta: {
      type: String,
      default: ""
    },
    level: {
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

// This exists only for the itemprop. Visual title comes in .card-title
.lesson-plan__name {
  display: none;
}

.card-footer {
  padding: 2rem 0 0 0;
  font-family: $font-family-sans-serif;
  background-color: transparent;

  p {
    margin: 0;

    &.card--lesson-plan__level {
      font-weight: 400;
    }
  }
}
</style>
