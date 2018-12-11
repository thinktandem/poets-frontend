<template>
  <b-card-group
    :class="'card-deck--' + cardtype|lowercase"
    deck>
    <b-container>
      <b-row>
        <b-col
          cols="12"
          tag="header">
          <h2 class="card-deck__title">{{ title }}</h2>
          <a :href="link.href">{{ link.text }}</a>
        </b-col>
      </b-row>
      <b-row class="card-deck__cards">
        <b-col
          cols="12"
          md
          v-for="card in cards"
          :key="card.id"
          class="card-deck__card"
        >
          <component
            :is="card.cardType ? card.cardType : cardtype"
            v-bind="card" />
        </b-col>
      </b-row>
    </b-container>
  </b-card-group>
</template>

<script>
import PoemCard from "~/components/Poems/PoemCard";
import Poet from "~/components/Poet";
import FeatureCard from "~/components/FeatureCard";
import adCard from "~/components/adCard";

export default {
  components: {
    PoemCard,
    Poet,
    FeatureCard,
    adCard
  },
  props: {
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
    }
  }
};
</script>

<style lang="scss">
.card-deck {
  padding: 4rem 0;

  header {
    @include media-breakpoint-up(sm) {
      display: flex;
    }

    a {
      @extend %a--more;
      display: block;
      margin-bottom: 2rem;

      @include media-breakpoint-up(sm) {
        line-height: $h2-font-size;
      }
    }
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
      margin: 0;
    }
  }
}
</style>
