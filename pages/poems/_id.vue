<template>
  <div class="poem-page">
    <div v-if="poem.data.attributes.title.length > 0">    
      <h1> {{ poem.data.attributes.title }}</h1>
      <div class="container">
        <div class="row">
          <div class="col-8">
            {{ poem }}
          </div>
          <div class="col-4">
            other stuff{{ poemImage }}
          </div>
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

/*
 * Helper function to make GET request.
 */
export function getJsonData(url) {
  return axios.get(url)
    .then(response => {
      return response.data;
    });
}

export default {
  async asyncData({ params }) {
    //let url = apiUrl + `/node/poem/${params.id}`;
    //console.log(url);
    //let electricPantsDance = getJsonData(url)
    //  .then(data => {
    //    response.json({message: 'Request received!', data});
    //  });
    ////console.log(data);
    //let aPoemImage = {};//data.relationships;
    axios.get(apiUrl + `/node/poem/${params.id}`)
      .then(result => {
        console.log(result);
        const nodeData = result.data;
        return axios.get(apiUrl + `/file/file/${result.data.data.relationships.poem_image.data.id}`)
          .then(res => {
            const imgData = res.data;
            return true;
          });
       // return {result, aPoemImage};
      });
    return {
      poem: nodeData,
      poemImage: imgData
    };
  }
}
</script>

<style>

</style>
