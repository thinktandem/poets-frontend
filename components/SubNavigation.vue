<template>
  <b-navbar
    v-if="$store.state.showSubMenu"
    class="lib-nav-container shadow-sm d-flex"
    toggleable="md"
    type="dark"
    variant="dark"
  >
    <b-navbar-toggle
      class="border-0 bg-dark-gray"
      target="subnav_collapse"/>
    <b-collapse
      is-nav
      id="subnav_collapse"
    >
      <b-navbar-nav class="ml-auto">
        <b-nav-item
          v-for="(link, index) in links"
          :key="index"
          :to="link.to"
        >
          {{ index }}
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: "SubNavigation",
  props: {
    links: {
      type: Object,
      default: () => {}
    }
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
