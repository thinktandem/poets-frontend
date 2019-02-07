<template>
  <b-card
    class="card--prize"
    tag="article"
    itemscope
    itemtype="http://schema.org/Article"
  >
    <h3 class="prize-title">
      <b-link
        v-html="title"
        class="text-dark"
        :href="link"
        itemprop="title"
      />
    </h3>
    <div
      class="prize__body prize__body--fade font-serif-2"
      v-html="text"
    />
    <div class="prize-footer">
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
  name: "PrizeCardVue"
};
</script>

<style scoped>
</style>
