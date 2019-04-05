<template>
  <b-container class="py-5">
    <b-card class="shadow">
      <Register />
    </b-card>
  </b-container>
</template>

<script>
import Register from "~/components/Register";
export default {
  components: {
    Register
  },
  mounted() {
    // If we are already logged in then lets redirect to dashboard
    if (this.$auth.loggedIn) {
      this.$router.push("/dashboard");
    }
  }
};
</script>
