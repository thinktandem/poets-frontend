<template>
  <b-container tag="form">
    <h2>Form Elements</h2>
    <b-form-row>
      <b-col cols="12">
        <h3>Input Text</h3>
      </b-col>
      <b-form-group
        class="col-sm-6"
        description="This is a description."
        label="Required Field"
        label-for="input-text"
        :invalid-feedback="invalidFeedback"
        :valid-feedback="validFeedback"
        :state="state"
      >
        <b-input
          id="input-text"
          type="text"
          placeholder="Enter your name"
          v-model.trim="name" />
      </b-form-group>
    </b-form-row>
  </b-container>
</template>

<script>
export default {
  computed: {
    state() {
      return this.name.length >= 4 ? true : false;
    },
    invalidFeedback() {
      if (this.name.length > 4) {
        return "";
      } else if (this.name.length > 0) {
        return "Enter at least 4 characters";
      } else {
        return "Please enter something";
      }
    },
    validFeedback() {
      return this.state === true ? "Thank you" : "";
    }
  },
  data() {
    return {
      name: ""
    };
  }
};
</script>
