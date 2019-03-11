<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
import _ from "lodash";

export default {
  mounted() {
    // Get the raw data we need
    const raw = _(window.location.hash.substr(1).split("&"))
      .map(prop => prop.split("="))
      .fromPairs()
      .value();

    // Invoke our custom login method if we have raw data
    if (!_.isEmpty(_.compact(_.values(raw)))) {
      return this.$auth.loginWith("drupal", raw).then(() => {
        return this.$auth.fetchUser().then(user => {
          this.$auth.setUser(user);
          this.$auth.redirect(user.destination, true);
        });
      });
    }
  }
};
</script>

<style lang="css">
</style>
