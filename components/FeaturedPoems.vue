<template>
  <section class="featured-poems py-5">
    <promo-space variant="transparent"/>
    <b-container>
      <h2 class="font-serif ">Poems</h2>
      <b-card-group
        columns>
        <header class="d-flex flex-column pt-lg-5 mb-lg-4 pb-2">
          <p
            v-if="count >= 1"
            class="d-flex justify-content-lg-end"><b-link
              to="/poetsorg/poem"
              class="text-dark more">{{ count }} poems <i class="fancy-chevron"/> </b-link></p>
        </header>
        <poem-card
          v-if="poems !== null"
          :title="card.title"
          :text="card.text"
          :poet="card.poet"
          :year="card.year"
          :link="card.link"
          class="mb-4 mt-2 grande"
          v-for="(card, index) in poems"
          :key="index"/></b-card-group>
    </b-container>
  </section>
</template>

<script>
import PromoSpace from "~/components/PromoSpace";
import PoemCard from "~/components/Poems/PoemCard";
export default {
  name: "FeaturedPoems",
  components: { PoemCard, PromoSpace },
  props: {
    poems: {
      type: Array,
      default: null
    },
    count: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style lang="scss" scoped>
.featured-poems {
  background: url(/poets-mystery-man.png),
    linear-gradient(90deg, $gray-400, #c9cacb);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.card-columns {
  column-count: 1;
  .card {
    -webkit-column-break-inside: avoid;
    page-break-inside: avoid;
    break-inside: avoid;
    display: block;
  }
}
.fancy-chevron {
  @include chevron(0.8rem, 3px, 5px);
}
@include media-breakpoint-up(lg) {
  h2 {
    font-size: 4.4rem;
    line-height: 0.625;
    margin-bottom: -1.5rem;
  }
  .more {
    font-size: 1.9rem;
    line-height: 2rem;
  }
  .card-columns {
    column-count: 2;
    orphans: 2;
    padding: 0 5rem;
    column-gap: 4.1rem;
  }
}
</style>
