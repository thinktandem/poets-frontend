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

// List of oneall props
const oneAllProps = [
  "connection_token",
  "identity_vault_key",
  "oa_action",
  "oa_social_login_token"
];

// Helper to return correct bootstrap form state
const getState = (data = null) => {
  if (!_.isEmpty(data)) return true;
  else return null;
};

// Helper to validate oneall
const validateOneAll = (data = {}) => {
  // Make sure the data is full
  if (_.isEmpty(data)) {
    return false;
  }

  // Make sure we have all the props we need
  _.forEach(oneAllProps, key => {
    if (!_.has(data, "key")) return false;
  });

  // Make sure all the props are as they should be
  // NOTE: we do a REALLY weak UUID check here, maybe @TODO upgrade in the future?
  if (data.oa_action !== "social_login") return false;
  if (_.size(data.connection_token.split("-") !== 5)) return false;
  if (_.size(data.oa_social_login_token.split("-") !== 5)) return false;

  // We are good!
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
      const user = oneall ? this.oneall.connection_token : this.username;
      const pass = oneall ? process.env.CONSUMER_SECRET : this.password;

      // Attempt to login
      this.$auth
        .loginWith("drupal", user, pass, this.type)
        .then(() => {
          this.$auth.fetchUser().then(() => {
            // @TODO: have an option to redirect back to a particular place
            this.$router.back();
          });
        })
        .catch(error => {
          // Reset the form
          this.busy = false;
          this.type = "password";
          this.$store.commit("updatePostData", {});
          // Show the problem
          const defaultMessage = "Something went wrong!";
          this.$toast
            .error(_.get(error, "data.message", defaultMessage))
            .goAway(7777);
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
