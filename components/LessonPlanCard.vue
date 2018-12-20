
<template>
  <b-card
    class="card--lesson-plan"
    :title="title"
    tag="article"
    title-tag="h3"
  >
    <span
      class="card__title"
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

.card-footer {
  p {
    &.card--lesson-plan__level {
      font-weight: 400;
    }
  }
}
</style>
