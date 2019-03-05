<template>
  <b-navbar
    toggleable="md"
    type="dark"
    class="shadow-sm d-flex"
    variant="dark">


    <b-navbar-brand
      tag="div"
      class="btn btn-md d-flex flex-row">
      <a
        href="/"
        class="d-inline-flex flex-row">Poets.org</a>
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
          v-for="(link, index) in links"
          :key="index"
          :href="link.href">{{ link.text }}</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item
          :href="loginUrl"
          class="navbar__login">Membership / Login</b-nav-item>

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
export default {
  /**
   * @todo replace with real data/prop
   * @return {{links: {href: string, text: string}[]}}
   */
  data() {
    return {
      loginUrl: `${process.env.baseURL}/user/login?redirect=frontend`,
      links: [
        {
          href: "/american-academy-poets/home",
          text: "Academy of American Poets"
        },
        {
          href: "/national-poetry-month",
          text: "National Poetry Month"
        },
        {
          href: "/magazine",
          text: "American Poets Magazine"
        }
      ]
    };
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
