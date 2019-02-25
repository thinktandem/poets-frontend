<template>
  <section class="card-deck--prizedeck">
    <b-container>
      <b-row>
        <b-col
          cols="12"
          tag="header"
        >
          <h2 class="font-serif prize-deck__title">{{ title }}</h2>
          <b-link
            class="prize-deck__link"
            v-if="link"
            :href="link.to"
          >{{ link.text }} <i class="fancy-chevron"/></b-link>
        </b-col>
      </b-row>
      <b-row class="prize-deck__cards d-flex">
        <b-col
          cols="12"
          :md="cols"
          v-for="(card, index) in cards"
          :key="index"
          class="card--prize"
        >
          <component
            :class="{'h-100': featured !== true }"
            :is="card.cardType ? card.cardType : cardtype"
            v-bind="card"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
// Import all the cards that might need to be used in a deck.
import PoemCard from "~/components/Poems/PoemCard";
import LessonPlanCard from "~/components/LessonPlanCard";
import Poet from "~/components/Libraries/Poet";
import adCard from "~/components/adCard";
import EssayCard from "~/components/EssayCard";
import BookCard from "~/components/Libraries/BookCard";
import CalloutCard from "./CalloutCard";
import TextCard from "~/components/Libraries/TextCard";

export default {
  components: {
    PoemCard,
    Poet,
    adCard,
    EssayCard,
    LessonPlanCard,
    BookCard,
    CalloutCard,
    TextCard
  },
  props: {
    featured: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    cardtype: {
      type: String,
      default: ""
    },
    cards: {
      type: Array,
      default: () => []
    },
    link: {
      type: Object,
      default: function() {}
    },
    cols: {
      type: String,
      default: "4"
    }
  }
};
</script>

<style lang="scss">
.card-deck--prizedeck {
  min-height: 464px;
  background: linear-gradient(270deg, #8195a6 0%, #637381 100%);
  padding-top: 4rem;
  padding-bottom: 4rem;
  header {
    color: $white;
    padding-bottom: 2rem;

    @include media-breakpoint-up(sm) {
      display: flex;
    }

    a {
      @include media-breakpoint-up(sm) {
        line-height: $h2-font-size;
      }
    }
    .prize-deck__link {
      font-size: 1.25rem;
      line-height: 2;
      font-weight: 500;
      color: $white;
    }
  }
  .fancy-chevron {
    @include chevron(0.5rem, 2px, 2px);
    border-right: 2px solid $white;
    border-bottom: 2px solid $white;
  }
  .prize-deck__title {
    font-family: $font-family-serif;
    font-style: italic;
    color: $white;

    @include media-breakpoint-up(sm) {
      flex-grow: 1;
    }
  }
}
</style>
