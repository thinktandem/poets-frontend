<template>
  <b-link :to="logo.link">
    <b-img
      :src="logo.src"
      :alt="logo.alt"
      fluid/>
  </b-link>
</template>
<script>
export default {
  props: {
    logo: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style scoped lang="scss">
</style>
