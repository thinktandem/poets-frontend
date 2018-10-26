<template>
  <div class="hero-outer pt-4">
    <b-container>
      <div class="hero-outer__poets-hp-link pb-3">
        <a href="/">
          <span class="hero-outer__poets-hp-link-1">poets</span><span class="hero-outer__poets-hp-link-2">.org</span>
        </a>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-9">
          <div
            v-for="quote in quotes"
            :key="quote.quote"
            class="hero-outer__quote-data">
            <div class="hero-outer__quote pb-3">
              {{ quote.quote }}
            </div>
            <div class="hero-outer__attribution">
              {{ quote.attribution }}
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <AppHeroSearch />
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import AppHeroSearch from "~/components/AppHero/AppHeroSearch";

export default {
  components: {
    AppHeroSearch
  },

  /**
   * @todo: should/can this be a data/prop delivered by drupal?
   * @return {{ quotes: {quote: string, attribution: string}[]}}`
   */
  data() {
    let blah = `
      "Poetry offers us the capacity to carry in us and express the
       contradictory impulses that make us human."`;
    let attatt = "—Kwame Dawes, Academy of American Poets Chancellor (2018- )";

    return {
      quotes: [
        {
          quote: blah,
          attribution: attatt
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
.hero-outer {
  background-color: var(--blue);
  .hero-outer__poets-hp-link-1,
  .hero-outer__poets-hp-link-2 {
    font-size: 60px;
    font-weight: 700;
    color: var(--white);
  }
  .hero-outer__poets-hp-link-2 {
    color: var(--black);
  }
  .hero-outer__quote {
    font-family: "Poets Electra";
    font-style: italic;
    font-size: 36px;
  }
  .hero-outer__attribution {
    font-size: 14px;
  }
}
</style>
