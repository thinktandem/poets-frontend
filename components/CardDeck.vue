<template>
  <b-card-group
    :class="'card-deck--' + cardtype|lowercase"
    deck
  >
    <b-container>
      <b-row>
        <b-col
          cols="12"
          tag="header"
          class="d-flex flex-lg-row flex-column"
        >
          <h2 class="card-deck__title">{{ title }}</h2>
          <b-link
            class="card-deck__link"
            v-if="link"
            :href="link.to"
          >{{ link.text }} <i class="fancy-chevron"/></b-link>
        </b-col>
      </b-row>
      <b-row class="card-deck__cards d-flex">
        <b-col
          cols="12"
          :lg="cols"
          v-for="(card, index) in cards"
          :key="index"
          class="card-deck__card"
        >
          <component
            :class="{'h-100': featured !== true }"
            :is="card.cardType ? card.cardType : cardtype"
            v-bind="card"
          />
        </b-col>
      </b-row>
    </b-container>
  </b-card-group>
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
import Staff from "~/components/Aap/Staff";
import Chancellors from "~/components/Aap/Chancellors";
import Board from "~/components/Aap/Board";
import EAC from "~/components/Aap/EducationAdvisoryCouncil";

export default {
  components: {
    PoemCard,
    Poet,
    adCard,
    EssayCard,
    LessonPlanCard,
    BookCard,
    CalloutCard,
    TextCard,
    Staff,
    Chancellors,
    Board,
    EAC
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
.card-deck {
  header {
    @include media-breakpoint-up(sm) {
      display: flex;
    }

    a {
      display: block;
      margin-bottom: 2rem;

      @include media-breakpoint-up(sm) {
        line-height: $h2-font-size;
      }
    }
  }
  .fancy-chevron {
    @include chevron(0.5rem, 2px, 2px);
  }
  .card-deck__title {
    font-family: $font-family-serif;
    font-style: italic;

    @include media-breakpoint-up(sm) {
      flex-grow: 1;
    }
  }

  .card-deck__card {
    margin-bottom: 2rem;

    .card {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }
  .card-deck__link {
    font-size: 1.25rem;
    line-height: 2;
    font-weight: 500;
  }
}
</style>
