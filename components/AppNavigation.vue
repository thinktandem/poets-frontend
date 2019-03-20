<template>
  <b-navbar
    toggleable="md"
    type="dark"
    class="shadow-sm d-flex"
    variant="dark">


    <b-navbar-brand
      tag="div"
      class="btn btn-md d-flex flex-row">
      <b-link
        to="/"
        class="d-inline-flex flex-row">Poets.org</b-link>
      <span class="oi oi-caret-bottom d-inline-flex d-sm-inline-flex d-md-none flex-row"/>
    </b-navbar-brand>
    <b-navbar-toggle
      class="border-0 bg-dark-gray"
      target="nav_collapse"/>
    <b-collapse
      is-nav
      id="nav_collapse">

      <b-navbar-nav>
        <b-nav-item
          v-for="(link, index) in $store.state.topMenu"
          :key="index"
          :to="link.to">{{ link.text }}</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item
          v-show="!this.$auth.loggedIn"
          href="/login"
          class="navbar__login">Membership / Login</b-nav-item>
        <b-nav-item-dropdown
          v-show="this.$auth.loggedIn"
          id="nav_ddown_loggedin"
          :text="name"
          extra-toggle-classes="nav-link-loggedin"
          right>
          <b-dropdown-item :href="dashboardURL">Dashboard</b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-button
          class="d-block d-md-none"
          variant="secondary-dark"
          size="md"
          type="submit">Donate</b-button>

      </b-navbar-nav>

    </b-collapse>
    <b-button
      class="d-none d-md-flex"
      variant="secondary-dark"
      size="md"
      type="submit">Donate</b-button>
  </b-navbar>

</template>

<script>
import { get, isNil } from "lodash";

/*
 * Helper to get name
 */
const getName = (first = "My", last = "Account") => {
  // Alao handle the cases where first is null
  if (isNil(first)) {
    first = "My";
  }
  if (isNil(last)) {
    last = "Account";
  }
  return `${first} ${last}`;
};

/*
 * Helper to get dashboard url
 */
const getDashboardURL = (id = "") => {
  return `${process.env.baseURL}/user/${id}`;
};

export default {
  computed: {
    name() {
      return getName(
        get(this.$auth, "user.field_first_name", undefined),
        get(this.$auth, "user.field_last_name", undefined)
      );
    },
    dashboardURL() {
      return getDashboardURL(get(this.$auth, "user.drupal_internal__uid", ""));
    }
  },
  methods: {
    logout() {
      this.$auth.logout();
    }
  }
};
</script>

<style scoped lang="scss">
// So we can access breakpoints / spacer
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";

// mobile
.navbar-brand {
  align-items: center;
  background-color: var(--black);
  flex-grow: 1;
  justify-content: space-between;
  a {
    padding-top: $spacer / 2;
    padding-left: $spacer / 2;
    color: var(--blue-lightest);
  }
  // caret
  .oi {
    color: var(--blue-lightest);
    align-self: center;
  }
}

.navbar {
  // Makes things full height when text wraps
  align-items: stretch;
  text-align: center;

  .btn {
    border-radius: 0;
  }
}

// This is to make the hover take up the whole nav on desktop
.navbar-nav {
  @include media-breakpoint-up(md) {
    height: 100%;
  }
}

.nav-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: var(--black);
  }
}
// Desktop
@include media-breakpoint-up(md) {
  .navbar-brand {
    // reset the size of the brand element
    flex-grow: 0;
    // reset the padding on brand tag
    a {
      padding-top: initial;
      padding-left: initial;
    }
  }

  .navbar {
    .btn {
      // More spacious buttons
      padding: 20px;
    }
  }
  .navbar__login a {
    // a slight bit tighter on this link
    padding-right: $spacer * 0.75 !important;
  }
}
</style>
