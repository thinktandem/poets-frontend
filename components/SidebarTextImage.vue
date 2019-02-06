<template>
  <section class="sidebar-text-image">
    <component
      v-if="title.length >= 1"
      :is="titleTag">{{ title }}</component>
    <b-row>
      <b-col
        class="pr-5"
        md="8">
        <div
          class="pr-4"
          v-if="body.length >=1"
          v-html="body"/>
      </b-col>
      <b-col md="4">
        <div
          class="px-3"
          v-html="sidebarTop"
          v-if="sidebarTop !== null"/>
        <b-img-lazy
          class="pb-3 px-3"
          fluid
          v-if="img !== null"
          :src="img.src"
          :alt="img.alt"/>
        <div
          class="px-3"
          v-html="sidebarBottom"
          v-if="sidebarBottom !== null"/>
      </b-col>
    </b-row>
  </section>
</template>
<script>
export default {
  name: "SidebarTextImage",
  props: {
    titleTag: {
      type: String,
      default: "h4"
    },
    title: {
      type: String,
      default: ""
    },
    body: {
      type: String,
      default: ""
    },
    sidebarTop: {
      type: String,
      default: ""
    },
    sidebarBottom: {
      type: String,
      default: ""
    },
    img: {
      type: Object,
      default: null
    }
  }
};
</script>
<style lang="scss" scoped>
.sidebar-text-image {
  font-weight: 400;
}
</style>
