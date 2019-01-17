<template>
  <div class="resource px-3 bg-white">
    <b-img-lazy
      center
      fluid
      class="m-4 resource__image"
      :src="imgSrc"
      :alt="img.alt"/>
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
    img: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  asyncComputed: {
    imgSrc() {
      return this.$axios
        .$get(this.img.links.related)
        .then(response => {
          return response.data.meta.derivatives.resource_image;
        })
        .catch(error => console.log(error));
    },
    fileUrl() {
      return this.$axios
        .$get(this.file.links.related)
        .then(
          response => `${process.env.baseURL}${response.data.attributes.url}`
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
