<template>
  <div class="footer__utility">
    <b-container class="mx-auto my-1">
      <div class="row">
        <div class="col-8">
          <span
            v-for="link in links"
            :key="link.url"
            class="utility__links">
            <a :href="link.url">{{ link.text }}</a>
          </span>
          <div class="utility__links_copyright">
            © Academy of American Poets, 75 Maiden Lane, Suite 901, New York, NY 10038 
          </div>
        </div>
        <div class="col-4">
          <span class="utility__links_poets">
            <a href="https://poets.org">
              <b-img
                src="/images/poets-small.png"
              />
            </a>
          </span>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  /**
   * @todo: should/can this be a data/prop delivered by drupal?
   * @return {{ links: {text: string, url: string}[]}}`
   */
  data() {
    return {
      links: [
        {
          text: "Contact",
          url: "#"
        },
        {
          text: "About Us",
          url: "#"
        },
        {
          text: "For Advertisers",
          url: "#"
        },
        {
          text: "Press Center",
          url: "#"
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
}
.utility__links {
  padding: 12px;
}
.utility__links a {
  color: var(--white);
}
.utility__links_copyright {
  padding: 12px;
}
.utility__links_poets.col-4 {
  text-align: right;
}
</style>
