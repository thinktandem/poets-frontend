<template>
  <div class="newsletter-support-follow">
    <b-container>
      <b-row class="row">
        <b-col
          class="newsletter-form"
          md="4"
        >
          <AppNewsletter />
        </b-col>
        <b-col
          class="support"
          md="3"
          offset-sm="1"
        >
          <AppSupport />
        </b-col>
        <b-col
          class="follow"
          md="4"
        >
          <AppFollow />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AppNewsletter from "~/components/AppNewsletterSupportFollow/AppNewsletter";
import AppSupport from "~/components/AppNewsletterSupportFollow/AppSupport";
import AppFollow from "~/components/AppNewsletterSupportFollow/AppFollow";

export default {
  components: {
    AppNewsletter,
    AppSupport,
    AppFollow
  }
};
</script>
<style lang="scss">
.newsletter-support-follow {
  padding: 2.7rem 0 4.25rem 0;
  background-color: $gray-200;
  label {
    color: $indigo;
    line-height: 1.25rem;
  }
  h3.signup-title {
    padding: 1.1rem;
    margin-bottom: 0;
    font-size: 1.75rem;
    line-height: 2rem;
    border-bottom: 3px solid $newsletter-support-follow__h3__border-color;
    font-family: $font-family-serif;
    font-style: italic;
  }

  .support__content,
  .newsletter__content,
  .follow__content {
    padding: 1rem;
  }
}
</style>
