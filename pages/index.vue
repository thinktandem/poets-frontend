<template>
  <div>
    <daily-poem
      :poem="$store.state.poemOfTheDay.poem"
      :poet="$store.state.poemOfTheDay.poet"/>
    <promo-space variant="transparent"/>
    <product-feature
      :title="$store.state.productFeature.title"
      :sub-title="$store.state.productFeature.subTitle"
      :intro="$store.state.productFeature.intro"
      :contents="$store.state.productFeature.contents"
      :img="$store.state.productFeature.img"
      :link="$store.state.productFeature.link"/>
  </div>
</template>

<script>
import DailyPoem from "~/components/Poems/DailyPoem";
import PromoSpace from "~/components/PromoSpace";
import * as _ from "lodash";
import ProductFeature from "~/components/ProductFeature";
export default {
  layout: "default",
  components: {
    DailyPoem,
    PromoSpace,
    ProductFeature
  },
  async asyncData({ app, store, params }) {
    return {
      poems: {}
    };
  },
  async fetch({ app, store, params }) {
    // Fetch all poems with poem a day date somewhere today.
    const poemOfTheDayResponse = await app.$axios.$get("/poem-a-day", {
      params: {}
    });
    const theOnePoemOfTheDay = _.first(poemOfTheDayResponse);
    store.commit("updatePoemOfTheDay", {
      poet: {
        name: theOnePoemOfTheDay.poet.name,
        image: theOnePoemOfTheDay.poet.image
          ? theOnePoemOfTheDay.poet.image
          : "",
        alias: theOnePoemOfTheDay.poet.alias
      },
      poem: {
        title: theOnePoemOfTheDay.poem.title,
        text: theOnePoemOfTheDay.poem.text,
        soundCloud: theOnePoemOfTheDay.poem.soundcloud,
        alias: theOnePoemOfTheDay.poem.alias
      }
    });
    // Set the current hero
    store.commit("updateHero", {
      variant: "quote",
      lead:
        "Poetry offers us the capacity to carry in us and express the contradictory impulses that make us human.",
      subtext: "—Kwame Dawes, Academy of American Poets Chancellor (2018- )"
    });

    const featuredProductResponse = await app.$axios.$get(
      "/api/node/magazine",
      {
        params: {
          filter: {
            status: 1,
            promote: 1
          },
          page: {
            limit: 1
          },
          include: "field_image"
        }
      }
    );
    const featuredProduct = _.first(featuredProductResponse.data);
    let img = _(featuredProductResponse.included)
      .filter(include => include.type === "file--file")
      .first();
    store.commit("updateProductFeature", {
      data: featuredProductResponse,
      title: featuredProduct.attributes.title,
      intro: featuredProduct.attributes.body.processed,
      subTitle: featuredProduct.attributes.subtitle,
      contents: featuredProduct.attributes.contents,
      img: {
        src: img.links.magazine_cover.href,
        alt: "Magazine Cover"
      },
      link: {
        to: `/academy-american-poets/become-member`,
        text: "Become a member"
      }
    });
  }
};
</script>

<style>
</style>
