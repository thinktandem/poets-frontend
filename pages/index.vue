<template>
  <section class="container">
    <div class="content">
      {{ blog.data.attributes }}
      <div class="tubez">
        <youtube :video-id=blog.data.attributes.link>bullshit</youtube>
      </div>
  </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import axios from 'axios'
import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'
Vue.use(VueYouTubeEmbed)

export default {
  data() {
    return {
      blog: [],
      file: [],
      errors: []
    }
  },
  // Fetches posts when the component is created.
  created() {
    axios.get('https://poetscontentapi.lndo.site/api/tutorials/938c0e11-a6d8-48f5-8c34-06c7574cf81f')
    .then(response => {
      // JSON responses are automatically parsed.
      this.blog = response.data
      console.log(response.data)
    })
    .catch(e => {
      this.errors.push(e)
      console.log(e);
    })
    //axios.get('http://cmsbackend.lndo.site/jsonapi/file/file/85a55292-b6c3-4ded-8e98-c18cd00ce446')
    //.then(response => {
    //  // JSON responses are automatically parsed.
    //  this.file = response.data
    //  console.log(response.data)
    //})
    //.catch(e => {
    //  this.errors.push(e)
    //  console.log(e);
    //})
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
