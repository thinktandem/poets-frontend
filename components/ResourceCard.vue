<template>
  <div class="resource px-3 bg-white">
    <b-img-lazy
      center
      fluid
      class="m-4 resource__image"
      :src="img.src"
      :alt="img.alt"/>
    <h3 class="resource__title">{{ title }}</h3>
    <div class="resource__body">
      {{ body }}
    </div>
    <div class="text-center">
      <b-btn
        class="mt-4 mb-5"
        :to="link.to"
        variant="primary-dark">{{ link.text }}</b-btn>
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
    link: {
      type: Object,
      default() {
        return {
          to: null,
          text: "Download it Now"
        };
      }
    },
    img: {
      type: Object,
      default() {
        return {
          src: null,
          alt: null
        };
      }
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
