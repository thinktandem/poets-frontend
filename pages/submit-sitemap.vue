<template>
  <div/>
</template>
<script>
export default {
  mounted() {
    Promise.all([this.submitSitemap()]);
  },
  methods: {
    submitSitemap() {
      return this.$axios.$get(
        "https://www.google.com/ping?sitemap=https://poets.org/sitemap.xml"
      );
    }
  }
};
</script>
