<template>
  <b-card-group class="card-deck container"> deck
    <b-row>
      <h3>{{ title }}</h3>
      <nuxt-link to="{{ link.href }}">{{ link.title }}</nuxt-link>
    </b-row>
    <b-row>
      <b-card
        v-for="card in cards"
        :key="card.id"
        class="card-deck__card {{ card.classes }}">
      >

      <component :is="cardType" v-bind="props"></component>

      </b-card>
    </b-row>
  </b-card-group>
</template>

<script>

export default {
  props: ['title', 'link', 'cards']
  components: {
  },
  data() {
  }
};
</script>

<style scoped lang="scss">
</style>
