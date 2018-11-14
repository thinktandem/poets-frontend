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

  &__title {
    height: 44px;
    width: 276px;
    color: #ffffff;
    font-family: "Poets Electra";
    font-size: 40px;
    font-style: italic;
    line-height: 44px;
    text-align: center;
  }
}
</style>
