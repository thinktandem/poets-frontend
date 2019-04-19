<template>
  <div
    v-show="teaserTextExists"
    v-html="replaceFileUrl(teaserText)"/>
</template>

<script>
import _ from "lodash";
export default {
  name: "AppTeaserText",
  props: {
    text: {
      type: String,
      default: ""
    },
    length: {
      type: Number,
      default: 100
    }
  },
  computed: {
    teaserText() {
      if (this.teaserTextExists) {
        return this.text.length > this.length
          ? `${this.text.substr(0, this.text.lastIndexOf(" ", this.length))}...`
          : this.text;
      } else {
        return "";
      }
    },
    teaserTextExists() {
      return !_.isEmpty(this.text);
    }
  }
};
</script>
