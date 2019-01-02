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
import axios from "axios";
import qs from "qs";

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
      console.log("username: ", this.username);
      console.log("password: ", this.password);
      const password = this.password;
      const username = this.username;
      const data = {
        grant_type: "password",
        username: username,
        password: password,
        client_id: "b2c84c2c-b241-4611-b86e-7cc51801d0a1",
        scope: "vue_consumer"
      };
      axios
        .post("http://apipoetsd8.lndo.site/oauth/token", qs.stringify(data))
        .then(req => {
          console.log("token\n\n", req.data.access_token);
          let x = req.data.access_token;
          return x;
        })
        .then(x => {
          console.log("thenReq", x);
          axios
            .get(
              "http://apipoetsd8.lndo.site/api/user/user/e5e8b095-626d-400a-a8e5-6695a1bd10d3",
              {
                headers: {
                  Authorization: `Bearer ${x}`
                }
              }
            )
            .then(req => {
              console.log("req", req);
            });
        })
        .catch(err => {
          console.log("sadly gff is not the best");
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
