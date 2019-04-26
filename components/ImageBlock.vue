<template>
  <div>
    <component
      v-if="title.length >= 1"
      class="mb-4"
      :is="titleTag">{{ title }}</component>
    <div class="px-2">
      <b-img-lazy
        v-for="(img, i) in imgs"
        :key="i"
        v-if="img !== null"
        center
        fluid
        :src="img.src"
        :alt="img.alt"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageBlock",
  props: {
    titleTag: {
      type: String,
      default: "h3"
    },
    title: {
      type: String,
      default: ""
    },
    imgs: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped>
</style>
