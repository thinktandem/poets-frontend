<template>
  <b-img-lazy
    v-if="src !== null"
    :center="center"
    :fluid="fluid"
    :src="src"
    :width="width"
    :height="height"
    blank-color="#00B4F0"/>
  <b-img
    v-else
    blank
    :center="center"
    :fluid="fluid"
    :width="width"
    :height="height"
    blank-color="#00B4F0"/>
</template>

<script>
import * as _ from "lodash";
export default {
  name: "AppImage",
  props: {
    img: {
      type: Object,
      required: true
    },
    imgSrc: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "110"
    },
    height: {
      type: String,
      default: "110"
    },
    imageStyle: {
      type: String,
      default: "media_aside"
    },
    center: {
      type: Boolean,
      default: false
    },
    fluid: {
      type: Boolean,
      default: true
    }
  },
  asyncComputed: {
    /**
     * If we have an explicit image src, use that, if not, fetch img from Drupal
     * @return {String} The image source url.
     */
    async src() {
      return this.imgSrc.length >= 1
        ? this.imgSrc
        : this.$axios
            .$get(this.img.links.related)
            .then(response => {
              return response;
              // The response from Drupal is inconsistent depending on the
              // cardinality of the image field
              if (
                response.hasOwnProperty("data") &&
                response.data.contructor !== Array &&
                response.data.hasOwnProperty("meta") &&
                response.data.meta.hasOwnProperty("derivatives")
              ) {
                return response.data.meta.derivatives[this.imageStyle];
              } else if (response.data.constructor === Array) {
                const first = _.first(response.data);
                return first.meta.derivatives[this.imageStyle];
              } else {
                return "/images/bulb-book.png";
              }
            })
            .catch(error => {
              console.log(error);
              return "/images/bulb-book.png";
            });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
