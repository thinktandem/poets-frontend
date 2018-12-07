<template>
  <section
    class="promo p-4"
    :class="variant">
    <b-container class="mx-auto my-1">
      <p class="text-center text-uppercase promo__disclosure">Advertisment</p>
      <b-img
        class="mx-auto my-2 promo__image"
        fluid
        center
        blank
        blank-color="#F1E7D6"
        width="975"
        height="250"/>
    </b-container>
  </section>
</template>

<script>
export default {
  name: "PromoSpace",
  props: {
    variant: {
      type: String,
      default: "dark"
    }
  }
};
</script>
<style scoped>
.promo__disclosure {
  color: var(--dark-muted);
  font-weight: 400;
}
.promo.dark {
  background-color: var(--black);
}
.promo.transparent {
  background-color: transparent;
  .promo__disclosure {
    color: var(--dark);
  }
}
</style>
