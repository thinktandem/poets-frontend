<template>
  <div class="login-wrapper border border-light">
    <form
      class="form-signin"
      @submit.prevent="login">
      <h2 class="form-signin-heading">Please sign in</h2>
      <label
        for="inputUsername"
        class="sr-only">Username</label>
      <input
        v-model="username"
        type="text"
        id="inputUsername"
        class="form-control"
        placeholder="Username"
        required
        autofocus>
      <label
        for="inputPassword"
        class="sr-only">Password</label>
      <input
        v-model="password"
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required>
      <button
        class="btn btn-lg btn-primary btn-block"
        type="submit">Sign in</button>
    </form>
  </div>
</template>

<script>
// import axios from "axios";
// import qs from "qs";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      loggedIn: false
    };
  },
  methods: {
    login() {
      const password = this.password;
      const username = this.username;
      let bodyFormData = new FormData();
      bodyFormData.set("username", username);
      bodyFormData.set("password", password);
      bodyFormData.set("grant_type", "password");
      bodyFormData.set("client_id", "b2c84c2c-b241-4611-b86e-7cc51801d0a1");
      bodyFormData.set("scope", "vue_consumer");
      bodyFormData.set("response_type", "token");
      bodyFormData.set("token_type", "Bearer");
      this.$auth
        .loginWith("drupal", {
          data: bodyFormData
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
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
