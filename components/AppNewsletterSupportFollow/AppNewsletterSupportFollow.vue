<template>
  <div
    class="p-4 newsletter-support-follow">
    <b-container class="mx-auto my-1">
      <b-row class="row">
        <b-col
          class="newsletter-form"
          cols="4">
          <AppNewsletter />
        </b-col>
        <b-col
          class="support"
          cols="4">
          <AppSupport />
        </b-col>
        <b-col
          class="follow"
          cols="4">
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
<style scoped lang="scss">
.newsletter-support-follow {
  background-color: var(--gray-100);
}
</style>
<style lang="scss">
.newsletter,
.support,
.follow {
  .signup-title {
    font-size: 18px;
    font-weight: 100;
    border-bottom: 1px solid #ccc;
  }
}
</style>
