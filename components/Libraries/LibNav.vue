<template>
  <div
    class="lib-nav-container"
    fluid
    lg="12"
  >
    <b-nav
      class="lib-nav float-right"
      tabs
    >
      <b-nav-item
        to="/libraries"
        active
      >
        Library
      </b-nav-item>
      <b-nav-item
        to="poetsorg/poem"
      >
        Poems
      </b-nav-item>
      <b-nav-item
        to="/poetsorg/poet"
      >
        Poets
      </b-nav-item>
      <b-nav-item
        to="/poetsorg/text"
      >
        Texts
      </b-nav-item>
      <b-nav-item
        to="/poetsorg/book"
      >
        Books
      </b-nav-item>
      <b-nav-item
        to="/poetsorg/audio"
      >
        Audio
      </b-nav-item>
      <b-nav-item
        to="poetsorg/video"
      >
        Video
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
// So we can access breakpoints / spacer
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
.lib-nav-container {
  background-color: var(--gray-900);
  min-height: 42px;
  position: relative;
  top: -2px;
}
.lib-nav {
  .nav-item {
    padding-left: 12px;
    padding-right: 12px;
    a {
      color: var(--white);
    }
    a.active {
      color: var(--blue);
    }
  }
}
</style>
