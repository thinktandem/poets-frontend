<template>
  <section class="featured-poems py-5">
    <b-container>
      <h2 class="font-serif ">Poems</h2>
      <b-card-group 
        columns>
        <header class="d-flex flex-column pt-5 mb-4 pb-2">
          <p 
            v-if="count >= 1"
            class="d-flex justify-content-end"><b-link 
              to="/poetsorg/poem"
              class="text-dark more">{{ count }} poems ></b-link></p>
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
import PoemCard from "~/components/Poems/PoemCard";
export default {
  name: "FeaturedPoems",
  components: { PoemCard },
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
.card-columns {
  column-count: 2;
  orphans: 2;
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
    padding: 0 5rem;
    column-gap: 4.1rem;
    max-height: 67rem;
  }
}
</style>
