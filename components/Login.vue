<template>
  <div class="login-wrapper border border-light">
    <b-form
      class="form-signin">
      <h2 class="form-signin-heading">Please sign in</h2>
      <div id="oa_social_login_container" />
      <script type="text/javascript">
        /* Embeds the buttons into the container oa_social_login_container */
        var _oneall = _oneall || [];
        var callbackURL = callbackURL || `${window.location.origin}/login`;
        _oneall.push(['social_login', 'set_providers', ['facebook', 'google']]);
        _oneall.push(['social_login', 'set_callback_uri', callbackURL]);
        _oneall.push(['social_login', 'do_render_ui', 'oa_social_login_container']);
      </script>
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
  data() {
    return {
      busy: false,
      oneall: this.$store.state.postData,
      password: null,
      type: "password",
      username: null
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
  mounted() {
    // If we are already logged in then lets redirect to dashboard
    if (this.$auth.loggedIn) {
      this.$router.push("/dashboard");
    }
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
      const data = oneall ? this.oneall.identity : {};

      // Attempt to login
      this.$auth
        .loginWith("drupal", user, pass, this.type, data)
        .then(() => this.$auth.fetchUser())
        .catch(error => {
          const defaultMessage = "Something went wrong!";
          this.$toast
            .error(_.get(error, "data.message", defaultMessage))
            .goAway(7777);
        })
        .finally(() => {
          this.reset();
          // @TODO: need to be able to handle other destinations?
          this.$router.push("/dashboard");
        });
    },
    reset() {
      this.busy = false;
      this.type = "password";
      this.$store.commit("updatePostData", {});
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
