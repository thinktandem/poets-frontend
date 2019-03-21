<template>
  <div class="login-wrapper border border-light">
    <b-form
      class="form-signin">
      <h2 class="form-signin-heading">Please sign in</h2>
      <b-form-input
        v-model="username"
        size="lg"
        :disabled="busy"
        type="text"
        placeholder="Username"
        :state="hasUsername" />
      <b-form-input
        v-model="password"
        size="lg"
        :disabled="busy"
        type="password"
        placeholder="Password"
        :state="hasPassword" />
      <b-button
        variant="primary"
        size="lg"
        class="btn-block"
        :disabled="!submittable"
        @click="login"
        type="button">
        Sign in
      </b-button>
    </b-form>
  </div>
</template>

<script>
import _ from "lodash";

// Helper to return correct bootstrap form state
const getState = (data = null) => {
  if (!_.isEmpty(data)) return true;
  else return null;
};

export default {
  name: "Login",
  data() {
    return {
      username: null,
      password: null,
      busy: false
    };
  },
  computed: {
    hasPassword() {
      return getState(this.password);
    },
    hasUsername() {
      return getState(this.username);
    },
    submittable() {
      return this.hasUsername && this.hasPassword && !this.busy;
    }
  },
  methods: {
    login() {
      // Set the entire form as busy
      this.busy = true;

      // Make sure we have a username and password
      // @NOTE: this might be redundant
      if (!this.password || !this.username) {
        this.$toast
          .error("Make sure you enter a username AND password!")
          .goAway(3000);
      }

      // Attempt to login
      this.$auth.loginWith("drupal", this.username, this.password).then(() => {
        this.$auth
          .fetchUser()
          .then(user => {
            this.$auth.setUser(user);
          })
          .then(() => {
            this.$router.back();
          });
      });
    }
  }
};
</script>

<style lang="css">
body {
  background: #605B56;
}
.login-wrapper {
  background: #fff;
  width: 70%;
  margin: 12% auto;
}
.form-signin {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
