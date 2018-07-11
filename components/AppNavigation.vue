<template>
  <div class="container">
    <nav class="navbar">
      <div class="navbar-brand">
        <span class="navbar-item">
          <nuxt-link to="/" class="navbar-item">Poets.org</nuxt-link>
        </span>
        <nuxt-link to="/" class="navbar-item">Academy of American Poets</nuxt-link>
        <nuxt-link to="/" class="navbar-item">National Poetry Month</nuxt-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
.navbar-item {
  padding: 12px;
}
/* Create slide animation on mobile */
@media screen and (max-width: 999px) {
  .navbar-end {
    padding:0.5rem 1rem;
  }

  .navbar-menu {
    display: block;
    overflow: hidden;
    max-height: 0px;
    padding: 0rem 1rem;
    transition: max-height 0.2s;
  }

  .navbar-menu.is-active {
    max-height: 100vh;
    transition: max-height 0.5s;
  }
}

.nuxt-link-exact-active {
  color: #363636;
}
</style>
