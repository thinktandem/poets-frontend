<template>
  <b-media
    class="mb-4"
    :tag="tag">
    <b-img-lazy
      :blank-src="null"
      slot="aside"
      :src="imgSrc"
      :alt="img.alt"/>
    <component
      v-if="null !== title"
      class="media-title"
      :is="titleTag"><b-link :to="titleLink">{{ title }}</b-link></component>
    <b-media-body 
      v-if="null !== body" 
      v-html="teaserText"/>
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
      default() {
        return {
          id: "",
          alt: "Program Image"
        };
      }
    }
  },
  asyncComputed: {
    imgSrc() {
      return this.$axios
        .$get(`/api/file/file/${this.img.id}`)
        .then(response => {
          return response.data.meta.derivatives.media_aside;
        })
        .catch(error => console.log(error));
    },
    teaserText() {
      return this.body.length > 300
        ? `${this.body.substr(0, this.body.lastIndexOf(" ", 364))}...`
        : this.body;
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
