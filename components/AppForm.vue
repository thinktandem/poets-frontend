<template>
  <b-form @submit.prevent="checkForm">
    <b-form-input
      name="contactViaPigeon"
      id="contactViaPigeon"
      type="text"
      style="display:none !important"
      tabindex="-1"
      autocomplete="off"
      v-model="honeypot"/>
    <slot/>
  </b-form>
</template>
<script>
export default {
  name: "AppForm",
  data() {
    return {
      honeypot: ""
    };
  },
  methods: {
    checkForm(e) {
      return this.honeypot.length === 0
        ? this.$emit("submit")
        : this.$emit("botdetected");
    }
  }
};
</script>
