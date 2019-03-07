<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  layout: "logout",
  mounted() {
    this.$auth.logout();
    this.$auth.redirect("home", true);
  }
};
</script>

<style>
</style>
