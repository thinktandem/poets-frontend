<template>
  <b-img
    :src="logo.src"
    :alt="logo.alt"/>
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
