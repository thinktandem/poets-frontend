<template>
  <b-card
    class="card--essay"
    tag="article"
    itemscope
    itemtype="http://schema.org/CreativeWork"
    no-body
  >
    <link
      itemprop="additionalType"
      href="http://schema.org/ArchiveComponent">
    <b-card-body class="d-flex justify-content-between flex-column align-content-between">
      <h3 class="card-title">
        <b-link
          class="text-dark"
          :to="link"
          itemprop="name"
        >
          {{ title }}
        </b-link>
      </h3>
      <div
        class="card__body card__body--fade"
        v-html="replaceFileUrl(text)"
      />
      <div class="card-footer">
        <p
          class="card__name"
          itemprop="author"
        >{{ author }}</p>
        <p
          class="card__year"
          itemprop="datePublished"
        >{{ year }}</p>
      </div>
    </b-card-body>
  </b-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    author: {
      type: String,
      default: ""
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
  .card__body {
    font-weight: 400;
  }
  .card__body card__body--fade {
    font-family: "Founders Grotesk";
    font-weight: 400;
  }
}
</style>
