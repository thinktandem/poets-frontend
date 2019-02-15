<template>
  <b-navbar
    class="lib-nav-container shadow-sm d-flex"
    toggleable="md"
    type="dark"
    variant="dark"
  >
    <b-navbar-toggle
      class="border-0 bg-dark-gray"
      target="nav_collapse"/>
    <b-collapse
      is-nav
      id="nav_collapse"
    >
      <b-navbar-nav class="ml-auto">
        <b-nav-item
          :to="{name: academy-american-poets-staff}"
        >
          Staff
        </b-nav-item>
        <b-nav-item
          :to="{name: academy-american-poets-chancellors}"
        >
          Chancellors
        </b-nav-item>
        <b-nav-item
          :to="{name: academy-american-poets-board-directors}"
        >
          Board of Directors
        </b-nav-item>
        <b-nav-item
          href="/academy-american-poets/education-advisory-council"
        >
          Education Advisory Council
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
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
.navbar-nav {
  .nav-item {
    padding-left: 12px;
    padding-right: 12px;
    border-bottom: none;
    a.nav-link {
      color: var(--white);
    }
    a.active {
      background-color: var(--white);
      color: var(--blue) !important;
      padding-bottom: 10px;
      @include media-breakpoint-down(md) {
        background-color: var(--gray-800);
      }
    }
    a:hover {
      background-color: var(--black);
      color: var(--blue) !important;
    }
  }
}
</style>
