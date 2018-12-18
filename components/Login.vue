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
      password: ""
    };
  },
  methods: {
    login() {
      console.log("loggedIn: ", this.$auth.loggedIn);
      console.log("username: ", this.username);
      console.log("password: ", this.password);
      const password = this.password;
      const username = this.username;
      this.$auth.loginWith("local", {
        data: {
          username: username,
          password: password,
          grant_type: "password",
          client_id:
            process.env.API_CLIENT_ID || "b2c84c2c-b241-4611-b86e-7cc51801d0a1",
          client_secret: process.env.API_CLIENT_SECRET || "a"
        }
      });
      // this.$auth.loginWith("poets-api");
      // const apiUrl = process.env.API_URL || "http://apipoetsd8.lndo.site";
      // console.log(apiUrl);
      // console.log("clientId ", process.env.API_CLIENT_ID);
      // console.log(this.username, this.password);
      // const data = {
      //   username: this.username,
      //   password: this.password,
      //   grant_type: "password",
      //   client_id:
      //     process.env.API_CLIENT_ID || "b2c84c2c-b241-4611-b86e-7cc51801d0a1",
      //   client_secret: process.env.API_CLIENT_SECRET || "a"
      // };
      // const options = {
      //   method: "POST",
      //   data: qs.stringify(data),
      //   url: apiUrl + "/oauth/token"
      // };
      // console.log(options);
      // axios(options)
      //   .then(req => {
      //     console.log("thenReq", req.data.access_token);
      //     const options = {
      //       headers: {
      //         Authorization: `Bearer ${req.data.access_token}`
      //       },
      //       url: apiUrl + "/api/user/user/"
      //     };
      //     axios(options).then(req => {
      //       console.log("req", req);
      //     });
      //   })
      //   .catch(err => {
      //     console.log("sadly gff is not the best");
      //     console.log(err);
      //   });
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
