<template>
  <b-container class="py-5">
    <b-card class="shadow">
      <Login
        show-social-login
        show-register-link
        show-reset-link />
    </b-card>
  </b-container>
</template>

<script>
import Login from "~/components/Login";
export default {
  components: {
    Login
  },
  mounted() {
    // If we are already logged in then lets redirect to dashboard
    if (this.$auth.loggedIn) {
      this.$router.push("/dashboard");
    }
  }
};
</script>
