
<template>
  <b-card
    class="card--lesson-plan"
    tag="article"
    :link="numTexts"
  >
    <h3 class="card-title">
      <b-link
        :to="view_node"
        itemprop="title"
      >
        {{ title }}
      </b-link>
    </h3>
    <div
      v-html="field_texttype"
      class="card--lesson-plan__header"
    />
    <div class="card-footer">
      <p class="card--lesson-plan__meta">{{ field_contributors }}</p>
      <p class="card--lesson-plan__level">{{ field_date_published }}</p>
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
    field_date_published: {
      type: String,
      default: ""
    },
    field_contributors: {
      type: String,
      default: ""
    },
    field_texttype: {
      type: String,
      default: ""
    },
    view_node: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss">
.card--lesson-plan {
  border-color: var(--tertiary-orange);
  .card-title {
    a {
      color: var(--gray-900);
    }
    a:hover {
      text-decoration: underline;
    }
  }
}
.card-footer {
  p {
    &.card--lesson-plan__level {
      font-weight: 400;
    }
  }
}
</style>
