<template>
  <div class="login-wrapper border border-light">
    <Register
      :redirect="redirect"
      v-show="showRegistrationForm" />
    <b-form
      v-show="!showRegistrationForm"
      class="form-signin">
      <h2 class="form-signin-heading">{{ title }}</h2>
      <span
        v-show="showRegisterLink"
        class="create-account">
        Don't have an account?
        <b-link
          class="float-right"
          @click="register">Create one >>
        </b-link>
      </span>
      <div v-show="showSocialLogin">
        <div id="oa_social_login_container" />
        <script type="text/javascript">
          /* Embeds the buttons into the container oa_social_login_container */
          var _oneall = _oneall || [];
          var callbackURL = callbackURL || window.location.href;
          _oneall.push(['social_login', 'set_providers', ['facebook', 'google']]);
          _oneall.push(['social_login', 'set_custom_css_uri', `${window.location.origin}/social/oneall.css`]);
          _oneall.push(['social_login', 'set_callback_uri', callbackURL]);
          _oneall.push(['social_login', 'do_render_ui', 'oa_social_login_container']);
        </script>
        <div class="or-lines">OR</div>
      </div>
      <label
        class="sr-only"
        for="username">Username</label>
      <b-form-input
        v-model="username"
        name="username"
        size="lg"
        class="my-2"
        :disabled="busy"
        type="text"
        placeholder="Username"
        :state="hasUsername" />
      <label
        class="sr-only"
        for="password">Password</label>
      <b-form-input
        v-model="password"
        size="lg"
        name="password"
        class="my-2"
        :disabled="busy"
        type="password"
        placeholder="Password"
        :state="hasPassword" />
      <b-button
        variant="primary"
        size="lg"
        class="btn-block my-2"
        :disabled="!submittable"
        @click="login"
        type="button">
        Sign in
      </b-button>
      <small v-show="showResetLink">
        <b-link
          class="float-right"
          to="/reset">Reset password
        </b-link>
      </small>
    </b-form>
  </div>
</template>

<script>
import _ from "lodash";
import utils from "~/plugins/auth-utils";
import Register from "~/components/Register";

// Helper to get email from identity data
const getEmail = (emails = []) =>
  _.first(
    _(emails)
      .filter(email => email.is_verified)
      .map(email => email.value)
      .value()
  );

// Helper to parse identity data
const parseIdentity = (data = {}) =>
  _.merge({}, _.pick(data, ["identity_token", "provider"]), {
    last: _.get(data, "name.familyName"),
    first: _.get(data, "name.givenName"),
    email: getEmail(data.emails)
  });

// Helper to validate oneall user data
const validateOneAll = (data = {}) => {
  if (_.isEmpty(data)) return false;
  if (!_.has(data, "user_token")) return false;
  if (_.isEmpty(data.user_token)) return false;
  if (!_.has(data, "identity")) return false;
  if (_.isEmpty(data.identity)) return false;
  return true;
};

export default {
  name: "Login",
  components: {
    Register
  },
  data() {
    return {
      busy: false,
      oneall: this.$store.state.postData,
      password: null,
      type: "password",
      username: null,
      showRegistrationForm: false
    };
  },
  props: {
    redirect: {
      type: String,
      default: "/dashboard"
    },
    showRegisterLink: {
      type: Boolean,
      default: false
    },
    showResetLink: {
      type: Boolean,
      default: false
    },
    showSocialLogin: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "Sign in with"
    }
  },
  computed: {
    hasPassword() {
      return utils.getState(this.password);
    },
    hasUsername() {
      return utils.getState(this.username);
    },
    submittable() {
      return this.hasUsername && this.hasPassword && !this.busy;
    }
  },
  mounted() {
    /* The library is loaded asynchronously */
    // @NOTE: there has to be a better way to load this right?
    const oa = document.createElement("script");
    oa.type = "text/javascript";
    oa.async = true;
    oa.src = "//poets.api.oneall.com/socialize/library.js";
    const s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(oa, s);

    // If we have post data let's set some things and start login automatically
    if (validateOneAll(this.oneall)) {
      this.type = "oneall";
      this.login();
    }
  },
  methods: {
    login() {
      // Set the entire form as busy
      this.busy = true;

      // Make sure we have a username and password if this is password mode
      if (this.type === "password" && (!this.password || !this.username)) {
        this.$toast
          .error("Make sure you enter a username AND password!")
          .goAway(3000);
      }

      // Get the username/pass to use based on mode
      const oneall = this.type === "oneall";
      const user = oneall ? this.oneall.user_token : this.username;
      const pass = oneall ? undefined : this.password;
      const data = oneall ? parseIdentity(this.oneall.identity) : {};

      // Attempt to login
      this.$auth
        .loginWith("drupal", user, pass, this.type, data)
        .then(() => this.$auth.fetchUser())
        .catch(error => {
          this.$toast
            .error(_.get(error, "data.message", "Something went wrong!"))
            .goAway(7777);
        })
        .finally(() => {
          this.reset();
          this.$router.push(this.redirect);
        });
    },
    register() {
      this.showRegistrationForm = true;
    },
    reset() {
      this.busy = false;
      this.type = "password";
      this.$store.commit("updatePostData", {});
    }
  }
};
</script>

<style lang="scss">
#oa_social_login_container {
  margin-top: 25px;
}
.or-lines {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin: 1em 0;
  font-size: 0.8125em;
  font-weight: 700;

  &:before,
  &:after {
    display: inline-block;
    content: "";
    background-color: #ccc;
    width: 50%;
    height: 1px;
  }
}
</style>
