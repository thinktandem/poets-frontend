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
        href="/libraries"
        active
      >
        Library
      </b-nav-item>
      <b-nav-item
        href="poetsorg/poem"
      >
        Poems
      </b-nav-item>
      <b-nav-item
        href="/poetsorg/poet"
      >
        Poets
      </b-nav-item>
      <b-nav-item
        href="/poetsorg/text"
      >
        Texts
      </b-nav-item>
      <b-nav-item
        href="/poetsorg/book"
      >
        Books
      </b-nav-item>
      <b-nav-item
        href="/poetsorg/audio"
      >
        Audio
      </b-nav-item>
      <b-nav-item
        href="poetsorg/video"
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
  margin-top: -2px;
  background-color: var(--gray-900);
  min-height: 42px;
}
.nav-tabs {
  border-bottom: none;
}
.lib-nav {
  .nav-item {
    padding-left: 12px;
    padding-right: 12px;
    border-bottom: none;
    a {
      color: var(--white);
    }
    a.active {
      color: var(--blue);
    }
  }
}
</style>
