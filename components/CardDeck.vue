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
          <h2
            :class="titleClass"
            class="card-deck__title font-italic"
          >{{ title }}</h2>
          <b-link
            class="card-deck__link text-color"
            v-if="link"
            :href="link.to"
          >{{ link.text }} <i class="fancy-chevron" /></b-link>
        </b-col>
      </b-row>
      <b-row class="card-deck__cards d-flex">
        <b-col
          cols="12"
          v-bind="columnBinding"
          v-for="(card, index) in cards"
          :key="index"
          class="card-deck__card"
        >
          <PromoSpace
            v-if="ad ==='true' && Number(position) === index"
            variant="fpoet"
            dimensions="square"
          />
          <component
            v-else
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
import AppCard from "~/components/AppCard";
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
import PrizeCard from "~/components/PrizeCard";
import PromoSpace from "~/components/PromoSpace";

export default {
  components: {
    AppCard,
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
    EAC,
    PrizeCard,
    PromoSpace
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
    titleClass: {
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
    ad: {
      type: String,
      default: "false"
    },
    position: {
      type: String,
      default: "5"
    },
    link: {
      type: Object,
      default: function() {}
    },
    cols: {
      type: String,
      default: "4"
    },
    colSize: {
      type: String,
      default: "lg"
    }
  },
  computed: {
    columnBinding() {
      let obj = {};
      obj[this.colSize] = this.cols;
      return obj;
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
      color: $black;

      @include media-breakpoint-up(sm) {
        line-height: $h2-font-size;
      }
    }
  }
  .text-color {
    color: $black;
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

.card-deck--poet {
  background: url(/poets-mystery-man.png),
    linear-gradient(90deg, $green, $green);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  .poet__bio /deep/ p {
    a {
      color: var(--white);
      font-weight: 600;
    }
  }

  .card-deck__card {
    @include media-breakpoint-down(sm) {
      flex-basis: 50%;

      .poet__name-bio {
        top: calc(100% - 1.86rem);
      }

      .poet__bio {
        p {
          font-size: 0.75rem;
        }
      }

      .poet__name {
        font-size: 0.75rem;
        padding: 0.5rem;
      }

      &:first-child,
      &:last-child {
        flex-basis: 100%;

        .poet__name-bio {
          top: calc(100% - 3.65rem);
        }

        .poet__name {
          font-size: 1.25rem;
          padding: 1rem;
        }

        .poet__bio {
          p {
            font-size: inherit;
          }
        }
      }
    }
  }
}

.card-deck--prizecard {
  background: linear-gradient(270deg, #8195a6 0%, #637381 100%);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  padding-top: 2rem;

  a {
    color: $black;
  }
  .text-color {
    color: $black;
  }
  .card-deck__title {
    color: $white;
  }
  .card-deck__link {
    color: $white;
  }
  .fancy-chevron {
    border-right: 2px solid $white;
    border-bottom: 2px solid $white;
  }
}
</style>
