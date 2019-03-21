<template>
  <div
    v-show="text.length >= 1"
    v-html="teaserText"/>
</template>

<script>
export default {
  name: "AppTeaserText",
  props: {
    text: {
      type: String,
      default: ""
    },
    length: {
      type: Number,
      default: 364
    }
  },
  computed: {
    teaserText() {
      return this.text !== null && this.text.length > this.length
        ? `${this.text.substr(0, this.text.lastIndexOf(" ", this.length))}...`
        : this.text;
    }
  }
};
</script>
