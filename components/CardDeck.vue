<template>
  <section class="card-deck container">
    <b-row>
      <h3>{{ title }}</h3>
      <nuxt-link to="{{ link.href }}">{{ link.title }}</nuxt-link>
    </b-row>
    <b-row>
      <div
        v-for="card in cards"
        :key="card.id"
        class="card-deck__card {{ card.classes }}">
      >
      {{ card }}
      </div>
    </b-row>
  </section>
</template>

<script>

export default {
  components: {
  },
  data() {

  }
};
</script>

<style scoped lang="scss">
</style>
