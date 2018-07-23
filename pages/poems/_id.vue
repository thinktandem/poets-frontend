<template>
  <div class="poem-page">
    <div v-if="poem.data.attributes.title.length > 0">
      <h1> {{ poem.data.attributes.title }}</h1>
      <div>
        {{ poem }}
      </div>
    </div>
    <div v-else>
      No poem found.
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const apiUrl = process.env.API_URL;

// @TODO: we won't need this when the app is landoified.
if (process.env.NODE_ENV !== "production") {
  var dotenv = require('dotenv');
  dotenv.load();
}

export default {
  async asyncData({ params }) {
    let { data } = await axios.get(apiUrl + `/node/poem/${params.id}`);
    return {
      poem: data
    };
  }
}
</script>

<style>

</style>
