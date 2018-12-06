<template>
  <b-card class="ad-card">
    <a
      :href="link.href"
      class="ad__link">
      <b-img
        :src="img.src"
        fluid-grow />
    </a>
  </b-card>
</template>

<script>
export default {
  props: {
    cardType: {
      type: String,
      default: "adCard"
    },
    img: {
      type: Object,
      default: function() {}
    },
    link: {
      type: Object,
      default: function() {}
    }
  }
};
</script>

<style scoped lang="scss">
.ad-card {
  .card-body {
    padding: 0;
  }
}
</style>
