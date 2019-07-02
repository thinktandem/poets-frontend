<template>
  <b-card
    class="card--poem"
    tag="article"
    itemscope
    itemtype="http://schema.org/CreativeWork"
  >
    <link 
      itemprop="additionalType" 
      href="http://schema.org/ArchiveComponent">
    <h3 class="card-title font-serif font-italic">
      <b-link
        v-html="replaceFileUrl(title)"
        class="text-dark"
        :to="link"
        itemprop="name"
      />
    </h3>
    <div
      class="card__body card__body--fade poem__body font-serif"
      v-html="replaceFileUrl(text)"
    />
    <div class="card-footer">
      <p
        class="card__name"
        itemprop="author"
      >{{ poet.name }}</p>
      <p
        v-if="year"
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
