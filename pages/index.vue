<template>
  <div>
    <daily-poem
      :poem="$store.state.poemOfTheDay.poem"
      :poet="$store.state.poemOfTheDay.poet"/>
    <section class="bg-faded-img">
      <promo-space variant="transparent"/>
      <featured-poems
        :poems="$store.state.featuredPoems.poems"
        :count="$store.state.featuredPoems.count"/>
    </section>
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
import FeaturedPoems from "~/components/FeaturedPoems";
import PromoSpace from "~/components/PromoSpace";
import qs from "qs";
import * as _ from "lodash";
import ProductFeature from "~/components/ProductFeature";
export default {
  layout: "default",
  components: {
    DailyPoem,
    FeaturedPoems,
    PromoSpace,
    ProductFeature
  },
  async fetch({ app, store, params }) {
    // Set the current hero
    store.commit("updateHero", {
      variant: "quote",
      lead:
        "Poetry offers us the capacity to carry in us and express the contradictory impulses that make us human.",
      subtext: "—Kwame Dawes, Academy of American Poets Chancellor (2018- )"
    });
    // Fetch all poems with poem a day date somewhere today.
    const commonHeaders = {
      Accept: "application/json",
      "X-CONSUMER-ID": process.env.CONSUMER_ID
    };
    const poemOfTheDayRequest = {
      requestId: "poemADay",
      uri: "/poem-a-day",
      action: "view",
      headers: commonHeaders
    };
    const featuredPoemsQuery = qs.stringify({
      page: {
        limit: 4
      },
      include: "field_author"
    });
    const featuredPoemsRequest = {
      requestId: "featuredPoems",
      uri: `/api/node/poems?${featuredPoemsQuery}`,
      action: "view",
      headers: commonHeaders
    };
    const magazineQuery = qs.stringify({
      filter: {
        status: 1,
        promote: 1
      },
      page: {
        limit: 1
      },
      include: "field_image"
    });
    const magazineRequest = {
      requestId: "magazine",
      action: "view",
      headers: commonHeaders,
      uri: `/api/node/magazine?${magazineQuery}`
    };
    const requestCollection = [
      poemOfTheDayRequest,
      featuredPoemsRequest,
      magazineRequest
    ];
    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    };
    return app.$axios
      .$post("/subrequests?_format=json", requestCollection, requestOptions)
      .then(response => {
        store.commit("updatePageData", response);
        const theOnePoemOfTheDay = _.first(JSON.parse(response.poemADay.body));
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
        const featuredPoems = JSON.parse(response.featuredPoems.body);
        store.commit("updateFeaturedPoems", {
          count: featuredPoems.meta.count,
          poems: _.map(featuredPoems.data, poem => {
            return {
              title: poem.attributes.title,
              link: poem.attributes.path.alias,
              text: poem.attributes.body.processed,
              poet: {
                name: _.find(
                  featuredPoems.included,
                  include =>
                    include.id === poem.relationships.field_author.data[0].id
                ).attributes.title
              },
              year: poem.attributes.field_date_published.split("-")[0]
            };
          })
        });
        const featuredProduct = JSON.parse(response.magazine.body);
        let img = _(featuredProduct.included)
          .filter(include => include.type === "file--file")
          .first();
        const topProduct = _.first(featuredProduct.data);
        store.commit("updateProductFeature", {
          title: topProduct.attributes.title,
          intro: topProduct.attributes.body.processed,
          subTitle: topProduct.attributes.subtitle,
          contents: topProduct.attributes.contents,
          img: {
            src: img.links.magazine_cover.href,
            alt: "Magazine Cover"
          },
          link: {
            to: `/academy-american-poets/become-member`,
            text: "Become a member"
          }
        });
      });
  }
};
</script>

<style scoped>
.bg-faded-img {
  background-image: url("/poets-mystery-man.png");
  background-size: cover;
}
</style>
