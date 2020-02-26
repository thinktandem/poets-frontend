<template>
  <b-navbar
    v-if="$store.state.showSubMenu"
    class="lib-nav-container shadow-sm d-none d-md-flex"
    toggleable="md"
    type="dark"
    variant="dark"
  >
    <b-container>
      <b-navbar-toggle
        v-show="hasLinks"
        class="border-0 bg-dark-gray"
        target="subnav_collapse"/>
      <b-collapse
        is-nav
        id="subnav_collapse"
      >
        <b-navbar-nav class="ml-auto">
          <b-nav-item
            v-for="(link, index) in $store.state.subMenu"
            :key="index"
            :to="link.to"
            exact>
            {{ index }}
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { isEmpty } from "lodash";
export default {
  name: "SubNavigation",
  computed: {
    hasLinks() {
      return !isEmpty(this.links);
    }
  }
};
</script>

<style scoped lang="scss">
.nav-tabs {
  border-bottom: none;
}
.navbar-nav {
  padding-top: $spacer / 2;
  .nav-item {
    border-bottom: none;
    a.nav-link {
      color: var(--white);
    }
    a.active {
      background-color: var(--light);
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
