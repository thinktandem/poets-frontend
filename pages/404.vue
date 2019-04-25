<template>
  <b-container class="py-5 d-flex flex-column h-50 align-items-center justify-content-center">
    <div class="">
      <p>If you believe you've reached this page in error, please <b-link to="/academy-american-poets/contact-us">contact us</b-link> to let us know.</p>
    </div>
    <b-button
      variant="primary-dark"
      to="/">Return to the homepage</b-button>
  </b-container>
</template>
<script>
export default {
  name: "404",
  fetch({ store }) {
    store.commit("updateHero", {
      variant: "default",
      heading: "Page not Found",
      lead: "Unfortunately, we're unable to find the resource you requested"
    });
  }
};
</script>
