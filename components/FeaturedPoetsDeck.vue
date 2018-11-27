<template>
  <b-card-group
    class="featured-poet-deck"
    :class="'featured-poet-deck--'+cardtype">
    <b-container>
      <b-row>
        <b-col
          cols="12"
          tag="header">
          <h2 class="featured-poet-deck__title">{{ title }}</h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          cols="12"
          md
          v-for="card in cards"
          :key="card.id"
          class="featured-poet-deck__card"
        >
          <component
            :is="cardtype"
            v-bind="card"/>
        </b-col>
      </b-row>
    </b-container>
  </b-card-group>
</template>

<script>
export default {
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
      type: Object,
      default: function() {}
    },
    link: {
      type: Object,
      default: function() {}
    }
  }
};
</script>

<style scoped lang="scss">
.featured-poet-deck {
  background-color: var(--gray-darkest);
  max-height: 710px;
  overflow: visible;

  &__title {
    color: var(--white);
    font-family: "Poets Electra";
    font-size: 2.8rem;
    font-style: italic;
    line-height: 3rem;
    text-align: center;
    padding: 1.25rem 0;
  }
}
</style>
