<template>
  <b-card
    class="card--poem"
    tag="article"
    itemscope
    itemtype="http://schema.org/Article"
  >
    <h3 class="card-title">
      <b-link
        class="text-dark"
        :to="link"
        itemprop="title"
      >
        {{ title }}
      </b-link>
    </h3>
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
    },
    link: {
      type: String,
      default: "/"
    }
  }
};
</script>
