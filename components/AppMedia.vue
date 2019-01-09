<template>
  <b-media
    class="mb-5"
    :tag="tag">
    <b-img-lazy
      :blank-src="null"
      slot="aside"
      :src="imgSrc"/>
    <component
      v-if="null !== title"
      class="media-title"
      :is="titleTag"><b-link :to="titleLink">{{ title }}</b-link></component>
    <b-media-body 
      v-if="null !== body" 
      v-html="body"/>
  </b-media>
</template>

<script>
export default {
  name: "AppMedia",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    titleTag: {
      type: String,
      default: "h5"
    },
    title: {
      type: String,
      default: null
    },
    titleLink: {
      type: String,
      default: null
    },
    body: {
      type: String,
      default: null
    },
    imgId: {
      type: String,
      default: ""
    }
  },
  asyncComputed: {
    imgSrc() {
      return this.$axios.$get(`/api/file/file/${this.imgId}`).then(response => {
        // Strip the protocol from the URI.
        const uri = response.data.attributes.uri.value.replace(
          /(^\w+:|^)\/\//,
          ""
        );
        return `${process.env.baseURL}/sites/default/files/${uri}`;
      });
    }
  }
};
</script>

<style scoped lang="scss">
.media-body {
  font-weight: 400;
}
.media-title {
  font-size: 1.5rem;
}
</style>
