<template>
  <div class="resource px-3 bg-white">
    <app-image
      center
      fluid
      width="277"
      height="372"
      class="m-4 resource__image"
      image-style="resource_image"
      :img-src="imgSrc"
      :img="img"
    />
    <h3 class="resource__title">{{ title }}</h3>
    <div class="resource__body">
      {{ body }}
    </div>
    <div class="text-center">
      <b-btn
        class="mt-4 mb-5"
        target="_blank"
        :href="fileUrl"
        variant="primary-dark">Download it Now</b-btn>
    </div>
  </div>
</template>

<script>
import AppImage from "~/components/AppImage";
export default {
  name: "ResourceCard",
  components: { AppImage },
  props: {
    title: {
      type: String,
      default: ""
    },
    body: {
      type: String,
      default: ""
    },
    file: {
      type: Object,
      default() {
        return {};
      }
    },
    fileLink: {
      type: String,
      default: ""
    },
    img: {
      type: Object,
      default() {
        return {};
      }
    },
    imgSrc: {
      type: String,
      default: ""
    }
  },
  asyncComputed: {
    /**
     * If we are given a file link, use it, or fetch from Drupal
     * @return {$string} The URL for the file.
     */
    fileUrl() {
      return this.fileLink.length >= 1
        ? this.fileLink
        : this.$axios
            .$get(this.file.links.related)
            .then(
              response =>
                `${process.env.baseURL}${response.data.attributes.url}`
            )
            .catch(error => console.log(error));
    }
  }
};
</script>

<style scoped lang="scss">
.resource {
  border: 1px solid $gray-400;
}
.resource__title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: $indigo;
}
.resource__body {
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.4;
}
.resource__image {
  padding: 5px;
  border: 0.5px solid $gray-600;
}
</style>
