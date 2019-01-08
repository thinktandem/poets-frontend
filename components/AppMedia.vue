<template>
  <b-media
    class="mb-5"
    :tag="tag">
    <b-img
      v-if="null !== img"
      slot="aside" 
      :src="img.src" 
      :alt="img.alt"/>
    <component
      v-if="null !== title"
      class="media-title"
      :is="titleTag"><b-link :to="titleLink">{{ title }}</b-link></component>
    <b-media-body v-if="null !== body">{{ body }}</b-media-body>
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
    img: {
      type: Object,
      default: null
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
