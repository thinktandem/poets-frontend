<template>
  <div class="footer__utility pt-5 pb-5">
    <b-container class="mx-auto my-1">
      <div class="row">
        <div class="col-sm-12 col-md-10">
          <span
            v-for="link in links"
            :key="link.url"
            class="utility__links pr-3">
            <a :href="link.url">{{ link.text }}</a>
          </span>
          <div class="utility__links_copyright pt-4">
            © Academy of American Poets, 75 Maiden Lane, Suite 901, New York, NY 10038
          </div>
        </div>
        <div class="col-sm-12 col-md-2">
          <span class="utility__links_poets">
            <a href="/">
              <span class="poets-utility-link-1">poets</span><span class="poets-utility-link-2">.org</span>
            </a>
          </span>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          text: "Contact",
          url: "/academy-american-poets/contact-us"
        },
        {
          text: "About Us",
          url: "/academy-american-poets/about-us"
        },
        {
          text: "For Advertisers",
          url: "/academy-american-poets/advertise-us"
        },
        {
          text: "Press Center",
          url: "/academy-american-poets/press-center"
        },
        {
          text: "Credits",
          url: "/site-credits"
        },
        {
          text: "Privacy",
          url: "/privacy"
        }
      ]
    };
  }
};
</script>

<style scoped>
.footer__utility {
  color: var(--white);
  background-color: var(--black);
  font-weight: 400;
  .poets-utility-link-1,
  .poets-utility-link-2 {
    font-size: 28px;
    font-weight: 600;
    color: var(--blue);
  }
  .poets-utility-link-2 {
    color: var(--white);
  }
}
.utility__links a {
  color: var(--white);
  font-size: 14px;
}
.utility__links_poets.col-4 {
  text-align: right;
}
</style>
