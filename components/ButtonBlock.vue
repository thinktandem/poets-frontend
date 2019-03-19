<template>
  <div class="d-flex justify-content-center align-items-center">
    <b-button
      class="mt-3 px-5 py-3"
      :variant="variant"
      size="lg"
      :to="to">{{ text }}</b-button>
  </div>
</template>
<script>
export default {
  name: "ButtonBlock",
  props: {
    to: {
      type: String,
      default: "/"
    },
    text: {
      type: String,
      default: "Submit an Event"
    },
    variant: {
      type: String,
      default: "primary-dark"
    }
  }
};
</script>
