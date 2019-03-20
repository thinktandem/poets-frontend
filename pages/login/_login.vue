<template>
  <div>
    <Login />
    <nuxt />
  </div>
</template>

<script>
import Login from "~/components/Login";
export default {
  layout: "login",
  components: {
    Login
  }
};
</script>

<style>
</style>
