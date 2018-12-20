<template>
  <b-card
    class="card--essay"
    :title="title"
    tag="article"
    title-tag="h3"
    itemscope
    itemtype="http://schema.org/Article"
  >
    <span
      class="card__title"
      itemprop="title"
    >
      {{ title }}
    </span>
    <div
      class="card__body"
      v-html="text"
    />
    <div class="card-footer">
      <p
        class="card__name"
        itemprop="author"
      >{{ poet.name }}</p>
      <p
        class="card__year"
        itemprop="datePublished"
      >{{ year }}</p>
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
    text: {
      type: String,
      default: ""
    },
    poet: {
      type: Object,
      default: function() {}
    },
    year: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss">
.card--essay {
  border-bottom: 3px solid $brown;
}
</style>
