<template>
  <div class="footer__primary pt-5 pb-5">
    <b-container class="mx-auto">
      <div class="row">
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            poets.org
          </h3>
          <div
            v-for="link in linksPoets"
            :key="link.url"
            class="footer__primary__links p-1">
            <a :href="link.url">{{ link.text }}</a>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            academy of american poets
          </h3>
          <div
            v-for="link in linksAcademy"
            :key="link.url"
            class="footer__primary__links p-1">
            <a :href="link.url">{{ link.text }}</a>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            national poetry month
          </h3>
          <div
            v-for="link in linksPoetryMonth"
            :key="link.url"
            class="footer__primary__links p-1">
            <a :href="link.url">{{ link.text }}</a>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <h3 class="footer__primary__links__header">
            american poets 
          </h3>
          <div
            v-for="link in linksAmericanPoets"
            :key="link.url"
            class="footer__primary__links p-1">
            <a :href="link.url">{{ link.text }}</a>
          </div>
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
      linksPoets: [
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
        },
        {
          text: "Audio",
          url: "#"
        },
        {
          text: "Jobs for Poets",
          url: "#"
        },
        {
          text: "Materials for Teachers",
          url: "#"
        }
      ],
      linksAcademy: [
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
      ],
      linksPoetryMonth: [
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
      ],
      linksAmericanPoets: [
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
