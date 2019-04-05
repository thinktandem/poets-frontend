<template>
  <b-container class="py-5">
    <b-card class="shadow">
      <PasswordReset />
    </b-card>
  </b-container>
</template>

<script>
import PasswordReset from "~/components/PasswordReset";
export default {
  layout: "login",
  components: {
    PasswordReset
  }
};
</script>

<style>
</style>
