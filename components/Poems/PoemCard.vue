<template>
  <b-card
    class="card--poem"
    tag="article"
    itemscope
    itemtype="http://schema.org/Article"
  >
    <h3 class="card-title">
      <b-link
        v-html="replaceFileUrl(title)"
        class="text-dark"
        :href="link"
        itemprop="title"
      />
    </h3>
    <div
      class="card__body card__body--fade poem__body"
      v-html="replaceFileUrl(text)"
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
      default: null
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

<style lang="scss" scoped>
.grande {
  .card-title {
    font-size: 1.75rem;
  }
  .card__body {
    max-height: 16rem;
    font-size: 1.25rem;
  }
}
@include media-breakpoint-down(sm) {
  .card__body {
    font-size: 0.9rem;
  }
}
</style>
