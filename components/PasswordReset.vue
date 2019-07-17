<template>
  <div class="login-wrapper border border-light">
    <b-form
      class="form-signin">
      <h1 class="form-signin-heading">Reset password</h1>
      <b-form-input
        v-model="user"
        size="lg"
        :disabled="busy"
        type="text"
        placeholder="Username or email"
        :state="hasUsername" />
      <b-button
        variant="primary"
        size="lg"
        class="btn-block"
        :disabled="!submittable"
        @click="reset"
        type="button">
        E-mail new password
      </b-button>
    </b-form>
  </div>
</template>

<script>
import _ from "lodash";
import utils from "~/plugins/auth-utils";

// Helper to get reset data
const getResetData = user => {
  if (utils.isEmail(user)) return { mail: user };
  else return { name: user };
};

export default {
  layout: "login",
  data() {
    return {
      busy: false,
      user: null
    };
  },
  computed: {
    hasUsername() {
      return utils.getState(this.user);
    },
    submittable() {
      return this.hasUsername && !this.busy;
    },
    resetUrl() {
      return `${process.env.baseURL}/user/password?_format=json`;
    }
  },
  methods: {
    reset() {
      this.busy = true;
      this.$axios
        .post(this.resetUrl, getResetData(this.user))
        .then(() => {
          this.$router.push("/login", () => {
            this.$toast
              .success(`Password reset email has been sent for ${this.user}`)
              .goAway(7777);
          });
        })
        .catch(error => {
          const message = _.get(error, "data.message", "Something went wrong!");
          this.$sentry.captureException(new Error(message));
          this.$toast.error(message).goAway(7777);
        })
        .finally(() => {
          this.busy = false;
        });
    }
  }
};
</script>

<style>
h2 {
  font-size: 2.5rem;
}
.form-signin input[type="text"] {
  margin-bottom: 10px;
  border-bottom-right-radius: 0.3rem;
  border-bottom-left-radius: 0.3rem;
}
</style>
