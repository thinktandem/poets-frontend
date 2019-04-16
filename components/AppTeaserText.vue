<template>
  <div
    v-show="teaserTextExists"
    v-html="teaserText"/>
</template>

<script>
import _ from "lodash";
export default {
  name: "AppTeaserText",
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  computed: {
    teaserText() {
      return !_.isNil(this.text) && this.text.length > this.length
        ? `${this.text.substr(0, this.text.lastIndexOf(" ", this.length))}...`
        : this.text;
    },
    teaserTextExists() {
      return !_.isEmpty(this.text);
    }
  }
};
</script>
