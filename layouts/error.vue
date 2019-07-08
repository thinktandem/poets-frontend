<template>
  <div>
    <b-container
      v-if="error.statusCode === 404"
      class="py-5 d-flex flex-column h-50 align-items-center justify-content-center">
      <h1>{{ heading }}</h1>
      <div class="">
        <p>If you believe you've reached this page in error, please <b-link to="/academy-american-poets/contact-us">contact us</b-link> to let us know.</p>
      </div>
      <b-button
        variant="primary-dark"
        to="/">Return to the homepage</b-button>
    </b-container>
    <b-container v-else>
      <div>
        gff is another error.
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {}
    },
    heading: {
      type: String,
      default: "Page not Found"
    }
  },
  layout: "bannerless"
};
</script>
