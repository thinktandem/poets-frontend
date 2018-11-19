<template>
  <div class="bg-black p-4 promo">
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
  </div>
</template>

<script>
export default {};
</script>
<style scoped>
.promo__disclosure {
  color: var(--dark-muted);
  font-weight: 400;
}
</style>
