<template>
  <div>
    <AppNavigation />
    <Login />
    <AppFooterPrimary />
    <AppFooterUtility />
  </div>
</template>

<script>
import AppNavigation from "~/components/AppNavigation";
import AppFooterPrimary from "~/components/AppFooter/AppFooterPrimary";
import AppFooterUtility from "~/components/AppFooter/AppFooterUtility";
import Login from "~/components/Login";
export default {
  components: {
    AppNavigation,
    Login,
    AppFooterPrimary,
    AppFooterUtility
  }
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
