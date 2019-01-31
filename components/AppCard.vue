<template>
  <b-card
    class="`card--${type}`"
    tag="article"
  >
    <h3 class="card-title">
      <b-link
        class="text-dark"
        :to="link"
        itemprop="title"
      >
        {{ title }}
      </b-link>
    </h3>
    <div
      class="card__body card__body--fade font-serif-2"
      v-html="text"
    />
    <div class="card-footer">
      <p
        class="card__name"
      >{{ footer }}</p>
      <p
        class="card__year"
      >{{ subFooter }}</p>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "AppCard",
  props: {
    type: {
      type: String,
      default: "poem"
    },
    text: {
      type: String,
      default: ""
    },
    footer: {
      type: Object,
      default: function() {}
    },
    subFooter: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: "/"
    }
  }
};
</script>

<style scoped>
</style>
