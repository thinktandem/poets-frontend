<template>
  <section class="standard-text py-3">
    <b-container>
      <component
        v-show="title"
        :is="titleTag">{{ title }}</component>
      <b-row>
        <b-col
          md="12"
          v-show="body">
          <div
            class="standard-text__body"
            v-html="body"/>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
export default {
  name: "StandardTextBlock",
  props: {
    title: {
      type: String,
      default: ""
    },
    titleTag: {
      type: String,
      default: "h3"
    },
    body: {
      type: String,
      default: ""
    }
  }
};
</script>
<style scoped>
.standard-text__body {
  font-weight: 400;
}
</style>
