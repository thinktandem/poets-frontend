<template>
  <b-card
    class="card--poem"
    tag="article"
    itemscope
    itemtype="http://schema.org/Article"
  >
    <h3 class="card-title">
      <b-link
        v-html="title"
        class="text-dark"
        :to="link"
        itemprop="title"
      />
    </h3>
    <div
      class="card__body card__body--fade font-serif-2"
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
      type: String,
      default: ""
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
