<template>
  <div class="login-wrapper border border-light" />
</template>

<script>
import axios from "axios";

// Spoof our data until john wins it
const raw = {
  token_type: "Bearer",
  destination: "/",
  user: "52ab2bc0-effb-497d-a5fe-0213c6ccf9a9",
  expires_in: 866400,
  access_token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjdhZGZhMTI3YjljMGZmYWM5NmRhNjI2NTYwMmQ1OTg2OTI4ZGEwYjljNmU2YTQxZmEyZTk4MWUxZTA2MzZmYjM3ZWViZjJmMTJiN2I0YzcyIn0.eyJhdWQiOiJiMmM4NGMyYy1iMjQxLTQ2MTEtYjg2ZS03Y2M1MTgwMWQwYTEiLCJqdGkiOiI3YWRmYTEyN2I5YzBmZmFjOTZkYTYyNjU2MDJkNTk4NjkyOGRhMGI5YzZlNmE0MWZhMmU5ODFlMWUwNjM2ZmIzN2VlYmYyZjEyYjdiNGM3MiIsImlhdCI6MTU1MTc5NTk2MiwibmJmIjoxNTUxNzk1OTYyLCJleHAiOjE1NTI2NjIzNjIsInN1YiI6IjY3MzQ5MCIsInNjb3BlcyI6WyJhdXRoZW50aWNhdGVkIiwidnVlX2NvbnN1bWVyIl19.zef6Pq0R6Pm9gYgHRq7YbyVUxeXXNVBmGmnUeZL-VTFJv1Smk3RYRK5rhcWrry_b7mqD8JG3n83-ebxq8VKNrZw5DnsK9vB_Jn3Aq1SnOyNwNSIiJduonYlvgHZ0pjwyFLyueohTiS3R27Ew-M9cFb67UWqNTHuTykYcGnUjHWvwiQS-P8VTpAENXI7xGeibw3P1e1oNCrd5Aruap3Y-gQTODXefAcAJOy1m4SVJ_-_YAG9QAkKXGnsJjX4Z4EgWsmcgcg0IuQxOQb9NfiBkQTRE-7gQ1ZWBdqZItu9u5QTJSLXhFekDK_AhJINKM7lpLMtm1YQ2bvMoXdsQQLj9oQ",
  refresh_token:
    "def502005175e20f7e02ec478590281edd095581ed1b8549f7f09cb56daca5cbf90404a899b7a5ac51b7d6f658412d7c8320ccc68961401372c4a558cb5cd08f635cb4b1f9857772a59a9e03d8cb371b121252adf9f424aed9b54d071c31360bfc3fee6aa833518fcb06dcc69ca590e90fdf79f0bd279bca54daed8d18b42b8fccf31cb7136f00a37ad610791fc06c7dede2bcf176ab575e4ec55cb1dd979f2e99ec6ca49f40bd1b0ccfab6d6c08d155ab09858e6c9c5a702c4fe7e55e60964fe5679c64720ad85ca89b2b34c56bb75b46000953e792c92f5059d1f2c463cdcce67d323aeabe04ecb410a0cdb89dc3f473b83ea05db7848eb12a2da112ce58796a149f7642042bbf637b6050699b2383435e7af5306a9cc8141f32715b565f88f5311ae04b0204036ec062b6f67fd5c524afe30461167b02ed5b2c71e315d22d55ff7f570f379f9c95c23d04c1b875af5a131bc4ee7ac6c06abf8b27d4849fbfd170b015369286319cbf4f62cdc0e26cbd50030474c96c482063427ee69eaa77f575d9dc7ed2b86322e9861f3461b05442e18a61fb193bfb65f4a79614746f295a9e741a4305bfa99b"
};
const request = Buffer.from(JSON.stringify(raw)).toString("base64");

export default {
  name: "Login",
  data() {
    return {};
  },
  mounted() {
    // Get the query and parse it
    // SOME REOUTE QUERY GET THING HAPPENS HERE
    const data = JSON.parse(new Buffer(request, "base64").toString());
    // @TODO: Do some basic validation of the query data
    // Fetch user test
    const apiUrl = process.env.baseURL || "https://api-poetsd8.lndo.site";
    const options = {
      headers: {
        Authorization: `Bearer ${data.access_token}`
      },
      url: apiUrl + `/api/user/user/${data.user}`
    };
    axios(options).then(req => {
      console.log("req", req);
      this.$auth.loginWith("drupal", data);
    });

    // Test login
    // Call our custom auth-module schema to login
    // this.login();
    // Redirect to destination or home
    // window.location.href = "/";
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
</style>
