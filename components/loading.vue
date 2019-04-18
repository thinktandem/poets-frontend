<template lang="html">
  <div
    class="loading-page vh-100 vw-100 d-flex flex-column align-items-center justify-content-center"
    v-if="loading">
    <div class="spinner-container">
      <div class="sk-wave">
        <div class="sk-rect sk-rect1"/>
        <div class="sk-rect sk-rect2"/>
        <div class="sk-rect sk-rect3"/>
        <div class="sk-rect sk-rect4"/>
        <div class="sk-rect sk-rect5"/>
      </div>
    </div>
    <p
      class="text-primary"
      style="font-size: 3rem;">Loading...</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>

<style scoped lang="scss">
$spinkit-spinner-color: $blue;
@import "~spinkit/scss/spinners/3-wave";
.sk-rect {
  margin: 2px;
}
.loading-page {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  text-align: center;
}
</style>
