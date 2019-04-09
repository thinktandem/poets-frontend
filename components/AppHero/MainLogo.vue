<template>
  <b-link :to="logo.link">
    <b-img
      :src="logo.src"
      :alt="logo.alt"/>
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
