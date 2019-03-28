<template>
  <div class="login-wrapper border border-light">
    <b-form
      class="form-signin">
      <h2 class="form-signin-heading">Register</h2>
      <b-form-input
        v-model="first"
        size="lg"
        :disabled="busy"
        type="text"
        placeholder="First name"
        :state="hasFirstname" />
      <b-form-input
        v-model="last"
        size="lg"
        :disabled="busy"
        type="text"
        placeholder="Last name"
        :state="hasLastname" />
      <b-form-input
        v-model="email"
        size="lg"
        :disabled="busy"
        type="text"
        placeholder="Email"
        :state="isEmail" />
      <b-form-input
        v-model="pass"
        size="lg"
        :disabled="busy"
        type="password"
        placeholder="Password"
        :state="validatePassword" />
      <b-form-input
        v-model="pass2"
        size="lg"
        :disabled="busy"
        type="password"
        placeholder="Confirm password"
        :state="validatePassword" />
      <b-form-invalid-feedback :state="validatePassword">
        Your passwords must match!
      </b-form-invalid-feedback>
      <b-button
        variant="primary"
        size="lg"
        class="btn-block"
        :disabled="!submittable"
        @click="register"
        type="button">
        Create account
      </b-button>
    </b-form>
  </div>
</template>

<script>
import _ from "lodash";
import utils from "~/plugins/auth-utils";

// Helper to build user data
const buildUser = (email, pass, first, last) => ({
  name: { value: email },
  mail: { value: email },
  field_first_name: { value: first },
  field_last_name: { value: last },
  pass: { value: pass }
});

// Helper to get a decent looking error message
const parseError = error => {
  const message = _.get(error, "data.message", "Something went wrong!");
  // If this has : in it lets get the last part of it
  if (_.includes(message, ":")) {
    return _.last(message.split(":"));
  } else {
    return message;
  }
};

export default {
  layout: "login",
  data() {
    return {
      busy: false,
      email: null,
      first: null,
      last: null,
      pass: null,
      pass2: null
    };
  },
  computed: {
    hasFirstname() {
      return utils.getState(this.first);
    },
    hasLastname() {
      return utils.getState(this.last);
    },
    isEmail() {
      return utils.isEmail(this.email) ? true : null;
    },
    registerUrl() {
      return `${process.env.baseURL}/user/register?_format=json`;
    },
    submittable() {
      return (
        this.hasFirstname &&
        this.hasLastname &&
        this.isEmail &&
        this.validatePassword &&
        !this.busy
      );
    },
    validatePassword() {
      if (_.isNil(this.pass2) || _.isEmpty(this.pass2)) return null;
      else {
        return this.pass2 === this.pass;
      }
    }
  },
  methods: {
    register() {
      this.busy = true;
      this.$axios
        .post(
          this.registerUrl,
          buildUser(this.email, this.pass, this.first, this.last)
        )
        .then(() => {
          this.$auth
            .loginWith("drupal", this.email, this.pass, "password")
            .then(() => this.$auth.fetchUser())
            .then(() => {
              this.$router.push("/dashboard");
            });
        })
        .catch(error => {
          this.$toast.error(parseError(error)).goAway(7777);
        })
        .finally(() => {
          this.busy = false;
        });
    }
  }
};
</script>

<style>
.form-signin input[type="text"] {
  margin-bottom: 10px;
  border-bottom-right-radius: 0.3rem;
  border-bottom-left-radius: 0.3rem;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-right-radius: 0.3rem;
  border-top-left-radius: 0.3rem;
}
</style>
