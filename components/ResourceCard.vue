<template>
  <div class="resource pt-4 px-3 bg-white">
    <b-img-lazy
      v-if="!empty(imgs)"
      v-for="(img, i) in imgs"
      :key="i"
      center
      fluid
      width="277"
      height="372"
      class="resource__image mb-4"
      :src="img.src"
      :alt="img.alt"
    />
    <h3 class="resource__title">{{ title }}</h3>
    <div
      class="resource__body mb-4"
      v-html="replaceFileUrl(body)"/>
    <div
      class="text-center mb-4"
      v-if="fileUrl">
      <b-btn
        target="_blank"
        :href="fileUrl"
        variant="primary-dark">Download It Now</b-btn>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
export default {
  name: "ResourceCard",
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
    imgs: {
      type: Array,
      default: () => []
    }
  },
  asyncComputed: {
    /**
     * If we are given a file link, use it, or fetch from Drupal
     * @return {$string} The URL for the file.
     */
    fileUrl() {
      return this.fileLink.length >= 1 ? this.fileLink : this.buildFileUrl();
    }
  },
  methods: {
    buildFileUrl() {
      return this.file !== null
        ? `${process.env.baseURL}${this.file.attributes.uri.url}`
        : null;
    },
    empty(thing) {
      return isEmpty(thing);
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
