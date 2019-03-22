<template>
  <b-media
    :right-align="imgRight"
    class="mb-4"
    :tag="tag">
    <b-img-lazy
      fluid
      v-if="img !== null"
      slot="aside"
      :src="img.src"
      :alt="img.alt"/>
    <div
      v-if="date.length >= 1"
    ><time class="text-secondary">{{ niceDate }}</time></div>
    <component
      v-if="null !== title"
      class="media-title"
      :is="titleTag"><b-link :to="titleLink">{{ title }}</b-link></component>
    <b-media-body v-if="body">
      <app-teaser-text :text="body"/>
    </b-media-body>
  </b-media>
</template>

<script>
import niceDate from "~/plugins/niceDate.js";
import AppTeaserText from "~/components/AppTeaserText";
export default {
  name: "AppMedia",
  components: { AppTeaserText },
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
    },
    imgRight: {
      type: Boolean,
      default: false
    },
    date: {
      type: String,
      default: ""
    }
  },
  computed: {
    niceDate() {
      return niceDate.niceDate(this.date);
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
