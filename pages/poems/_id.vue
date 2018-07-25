<template>
  <div class="poem-page">
    <div class="container">
      <div class="row">
        <div clas="col-8">
          <h2>{{ poem.data.attributes.title }}</h2>
          {{ poem.data.attributes.body.value }}
        </div>
        <div class="col-4">
          <img :src="poem.included[0].attributes.url" width=100 />
        </div>
      </div>
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
    const { data } = await axios.get(`${apiUrl}/node/poem/${params.id}`,
      {
        params: {
          include: 'poem_image'
        }
      });

    return { poem: data };
  }
}
</script>

<style>

</style>
