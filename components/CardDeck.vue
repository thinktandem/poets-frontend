<template>
  <b-card-group class="card-deck" :class="'card-deck--'+cardtype">
    <b-container>
      <b-row>
        <b-col cols="12" tag="header">
          <h2 class="card-deck__title">{{ title }}</h2>
          <a :href="link.href">{{ link.text }}</a>
        </b-col>
      </b-row>
      <b-row>
          <b-col cols="12" md
            v-for="card in cards"
            :key="card.id"
            class="card-deck__card"
          >
            <component :is="cardtype" v-bind="card"></component>
          </b-col>
      </b-row>
    </b-container>
  </b-card-group>
</template>

<script>
export default {
  props: ["title", "link", "cards", "cardtype"]
};
</script>

<style scoped lang="scss">
</style>
