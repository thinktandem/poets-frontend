<template>
  <div class="teaching-intro">
    <p v-html="text" />
    <CardDeck
      cardtype="TeachingCard"
      :cards="cards"
    />
  </div>

</template>
<script>
import CardDeck from "~/components/CardDeck";
export default {
  components: {
    CardDeck
  },
  props: {
    cards: {
      type: Array,
      default: () => []
    },
    text: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss">
.teaching-intro {
  p {
    font-size: 1.25rem;
  }

  // We need some extra space to handle the offset image.
  .card-deck__card {
    &:nth-child(odd) {
      padding-right: 1.125rem;
    }
    &:nth-child(even) {
      padding-left: 1.125rem;
    }
  }
}
</style>
