<template>
  <div class="footer__primary pt-5 pb-5">
    <b-container class="mx-auto">
      <div class="row">
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            <b-link
              class="text-primary"
              to="/">
              poets.org
            </b-link>
          </h3>
          <div
            v-for="link in $store.state.porgFootMenu"
            :key="link.alias"
            class="footer__primary__links p-1">
            <b-link :to="link.relative">
              {{ link.title }}
            </b-link>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            <b-link
              class="text-primary"
              to="/academy-american-poets">
              academy of american poets
            </b-link>
          </h3>
          <div
            v-for="link in $store.state.aapFootMenu"
            :key="link.alias"
            class="footer__primary__links p-1">
            <b-link :to="link.relative">
              {{ link.title }}
            </b-link>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            <b-link
              class="text-primary"
              to="/national-poetry-month">
              national poetry month
            </b-link>
          </h3>
          <div
            v-for="link in $store.state.npmFootMenu"
            :key="link.alias"
            class="footer__primary__links p-1">
            <b-link :to="link.relative">
              {{ link.title }}
            </b-link>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            <b-link
              class="text-primary"
              to="/american-poets-magazine">
              american poets
            </b-link>
          </h3>
          <div
            v-for="link in $store.state.apmFootMenu"
            :key="link.alias"
            class="footer__primary__links p-1">
            <b-link :to="link.relative">
              {{ link.title }}
            </b-link>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
</script>

<style scoped lang="scss">
.footer__primary {
  background-color: var(--gray-800);
  .footer__primary__links__header {
    color: var(--blue);
  }
}
.footer__primary__links {
  color: var(--white);
  font-weight: 600;
  a {
    color: var(--white);
  }
}
</style>
