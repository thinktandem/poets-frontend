<template>
  <b-card
    class="card--poem"
    :title="title"
    tag="article"
    title-tag="h3"
    itemscope
    itemtype="http://schema.org/Article"
  >
    <span
      class="poem__name"
      itemprop="title"
    >
      {{ title }}
    </span>
    <div
      class="poem__body"
      v-html="text"/>
    <div class="card-footer">
      <p
        class="card--poem__name"
        itemprop="author"
      >{{ poet.name }}</p>
      <p
        class="card--poem__year"
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

<style lang="scss">
.card--poem {
  // This exists only for the itemprop. Visual title comes in .card-title
  .poem__name {
    display: none;
  }

  .poem__body {
    max-height: 9rem;
    position: relative;
    font-family: $font-family-serif;
    white-space: pre-wrap; // This preserves the line breaks.
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(rgba(255, 255, 255, 0), #fff);
    }
  }

  .card-footer {
    padding: 2rem 0 0 0;
    font-family: $font-family-sans-serif;
    background-color: transparent;

    p {
      margin: 0;
      font-size: $font-size-lg;

      &.card--poem__year {
        font-weight: 400;
      }
    }
  }
}
</style>
