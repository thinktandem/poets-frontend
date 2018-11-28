<template>
  <b-card
    class="feature"
    :img-src="img.src"
    :img-alt="img.alt"
    :title="title"
    :sub-title="subtitle"
    title-tag="h3"
    sub-title-tag="h4"
  >
    <p
      class="card-text"
      v-html="text"/>
  </b-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    subtitle: {
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
    },
    link: {
      type: Object,
      default: function() {}
    }
  }
};
</script>

<style lang="scss">
$feature__img__offset: 2rem;
.feature {
  padding-top: $feature__img__offset;
  flex-direction: row;
  background-color: transparent;
  align-items: flex-start;
  border: none;

  img {
    transform: translateY(-$feature__img__offset);
  }

  .card-body {
    padding: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    background-color: $white;

    .card-title {
      order: 2;
      width: 100%;
      font-size: 2rem;
      font-family: $font-family-sans-serif;
      font-weight: 600;
      font-style: normal;
    }

    .card-subtitle {
      order: 1;
      width: 100%;
      font-size: 1rem;
      color: $red-dark !important;
      font-weight: 600;
    }

    .card-text {
      order: 3;
      width: 100%;
      font-weight: normal;
      font-size: 0.875rem;
    }
  }
}
</style>
