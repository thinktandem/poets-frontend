<template>
  <b-card
    class="card--teaching"
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
    <b-img
      slot="header"
      v-if="img"
      :src="img.src"
      :alt="img.alt"
    />

    <div
      class="card__body"
      v-html="text"
    />
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
    img: {
      type: Object,
      default: function() {}
    }
  }
};
</script>

<style lang="scss">
.card.card--teaching {
  flex-direction: row;
  background-color: var(--white);
  border: none;

  h3 {
    font-size: 1.125rem;
    font-family: $font-family-sans-serif;
    font-weight: 600;
    font-style: normal;
    color: var(--primary-dark);
  }

  .card-header {
    padding: 0;
    width: 40%;
    background-color: var(--white);

    img {
      @extend .img-fluid;
      transform: translate(-1rem, -1rem);
    }
  }

  .card-body {
    padding: 0.5rem 1rem 2rem 0.25rem;
    flex-grow: 1;
    font-size: 0.875rem;
    font-weight: 400;
  }
}
</style>
