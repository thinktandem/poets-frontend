<template>
  <section class="app-card-columns py-5">
    <promo-space
      v-if="promo"
      dimensions="medium"
      variant="transparent"/>
    <b-container>
      <h2
        v-if="title.length > 0"
        class="font-serif font-italic">{{ title }}</h2>
      <b-card-group
        columns>
        <header
          v-if="count >= 1"
          class="d-flex flex-column pt-lg-5 mb-lg-4 pb-2">
          <p
            class="d-flex justify-content-lg-end"><b-link
              to="/poems"
              class="text-dark more">{{ count }} poems <i class="fancy-chevron"/> </b-link></p>
        </header>
        <component
          class="my-3"
          v-for="(card, index) in cards"
          v-bind="card.props"
          :is="card.type || PoemCard"
          :key="index"/>
      </b-card-group>
    </b-container>
  </section>
</template>

<script>
import PromoSpace from "~/components/PromoSpace";
import AppCard from "~/components/AppCard";
import BookCard from "~/components/Libraries/BookCard";
import EssayCard from "~/components/EssayCard";
import LessonPlanCard from "~/components/LessonPlanCard";
import PoetCard from "~/components/Libraries/Poet.vue";
import PoemCard from "~/components/Poems/PoemCard";
export default {
  name: "AppCardColumns",
  components: {
    AppCard,
    BookCard,
    EssayCard,
    LessonPlanCard,
    PoetCard,
    PoemCard,
    PromoSpace
  },
  props: {
    cards: {
      type: Array,
      default: null
    },
    count: {
      type: Number,
      default: 0
    },
    promo: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.app-card-columns {
  background: linear-gradient(#c9cacb 0%, transparent 20%),
    url(/poets-mystery-man.png), linear-gradient(90deg, $gray-400, #c9cacb);
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
