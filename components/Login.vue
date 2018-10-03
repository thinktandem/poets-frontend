<template>
  <div class="login-wrapper border border-light">
    <form class="form-signin" @submit.prevent="login">
      <h2 class="form-signin-heading">Please sign in</h2>
      <label for="inputUsername" class="sr-only">Username</label>
      <input v-model="username" type="text" id="inputUsername" class="form-control" placeholder="Username" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input v-model="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
      <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';

const apiUrl = process.env.API_URL;

// @TODO: we won't need this when the app is landoified.
if (process.env.NODE_ENV !== "production") {
  var dotenv = require('dotenv');
  dotenv.load();
}

export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      const data = {
        "username": this.username,
        "password": this.password,
        "grant_type": "password",
        "client_id": "74e7d449-8eba-4ee4-835c-6bc3eb1da06a",
        "client_secret": "abc123"
      };
      const options = {
        "method": 'POST',
        "headers": {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'TOKEN'
        },
        "data": qs.stringify(data),
        "url": 'https://poetsd8.lndo.site/oauth/token/'
      };
      console.log(this.username);
      console.log(this.password);

      axios(options)
        .then(req => this.loginSuccessful(req))
        .catch(() => this.loginFailed());
    }
  },
  loginSuccessful (req) {
    console.log(req);
    if (!req.data.token) {
      this.loginFailed();
      return;
    }
  
    localStorage.token = req.data.token;
    this.error = false;
  
    this.$router.replace(this.$route.query.redirect || '/authors');
  },
  loginFailed () {
    this.error = 'Login failed!'
    delete localStorage.token
  }
}
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
