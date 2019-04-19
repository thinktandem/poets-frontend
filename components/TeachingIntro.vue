<template>
  <div class="teaching-intro">
    <p v-html="replaceFileUrl(text)" />
    <card-deck
      cardtype="CalloutCard"
      :cards="cards"
      cols="6"/>
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
    font-weight: 400;
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
