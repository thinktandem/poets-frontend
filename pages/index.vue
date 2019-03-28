<template>
  <div>
    <daily-poem
      :poem="$store.state.poemOfTheDay.poem"
      :poet="$store.state.poemOfTheDay.poet"/>
    <app-card-columns
      promo
      title="Poems"
      :cards="$store.state.featuredPoems.cards"
      :count="$store.state.featuredPoems.count"/>
    <card-deck
      class="py-5"
      title="Poets"
      col-size="md"
      :link="$store.state.featuredPoets.link"
      cardtype="Poet"
      :cards="$store.state.featuredPoets.poets"/>
    <feature-stack
      v-if="$store.state.featuredContent && $store.state.featuredContent.length >= 1"
      :features="$store.state.featuredContent"
      title="Features"/>
    <app-announcements-awards />
    <product-feature
      v-if="$store.state.productFeature.title"
      :title="$store.state.productFeature.title"
      :sub-title="$store.state.productFeature.subTitle"
      :intro="$store.state.productFeature.intro"
      :contents="$store.state.productFeature.contents"
      :img="$store.state.productFeature.img"
      :link="$store.state.productFeature.link"/>
  </div>
</template>

<script>
import CardDeck from "~/components/CardDeck";
import DailyPoem from "~/components/Poems/DailyPoem";
import AppCardColumns from "~/components/AppCardColumns";
import qs from "qs";
import _ from "lodash";
import FeatureStack from "~/components/FeatureStack";
import ProductFeature from "~/components/ProductFeature";
import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
import MetaTags from "~/plugins/metatags";
export default {
  layout: "default",
  components: {
    AppAnnouncementsAwards,
    AppCardColumns,
    CardDeck,
    DailyPoem,
    FeatureStack,
    ProductFeature
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  async fetch({ app, store, params, route, menu }) {
    app.$buildBasicPage(app, store, "/home");

    const poemOftheDay = await app.$axios.$get(`/poem-a-day`);
    const theOnePoemOfTheDay = _.first(poemOftheDay);
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
        alias: theOnePoemOfTheDay.poem.alias,
        id: _.get(theOnePoemOfTheDay, "poem.uuid", null),
        about: _.get(theOnePoemOfTheDay, "poem.about", null)
      }
    });

    const featuredPoemsQuery = qs.stringify({
      page: {
        limit: 4
      },
      sort: "-promote",
      include: "field_author"
    });
    const featuredPoems = await app.$axios.$get(
      `/api/node/poems?${featuredPoemsQuery}`
    );
    store.commit("updateFeaturedPoems", {
      count: featuredPoems.meta.count,
      cards: _.map(featuredPoems.data, poem => {
        return {
          type: "PoemCard",
          props: {
            title: _.get(poem, "attributes.title", null),
            link: _.get(poem, "attributes.path.alias", null),
            text: _.get(poem, "attributes.body.processed", null),
            poet: {
              name: _.find(
                featuredPoems.included,
                include =>
                  include.id === poem.relationships.field_author.data[0].id
              ).attributes.title
            },
            year: _.get(poem, "attributes.field_date_published")
              ? _.get(poem, "attributes.field_date_published", "-").split(
                  "-"
                )[0]
              : null
          }
        };
      })
    });
    const featuredPoetsQuery = qs.stringify({
      filter: {
        status: 1,
        field_p_type: "poet"
      },
      sort: "-promote",
      page: {
        limit: 6
      },
      include: "field_image"
    });
    const featuredPoets = await app.$axios.$get(
      `/api/node/person?${featuredPoetsQuery}`
    );
    if (featuredPoets.data.length >= 1) {
      store.commit("updateFeaturedPoets", {
        poets: _.map(featuredPoets.data, poet => ({
          name: _.get(poet, "attributes.title", null),
          img: app.$buildImg(featuredPoets, poet, "field_image", "portrait", {
            src: "/images/default-person.png",
            alt: _.get(poet, "attributes.title") + " portrait"
          }),
          bio:
            _.get(poet, "attributes.body.summary") ||
            _.get(poet, "attributes.body.processed"),
          link: _.get(poet, "attributes.path.alias")
        })),
        link: {
          text: `${featuredPoets.meta.count} Poets`,
          to: "/poets"
        }
      });
    }
    const latestMag = await app.$latestMagazine({ app });
    store.commit("updateProductFeature", latestMag);
    const announcementRequestParams = qs.stringify({
      filter: {
        // Hard coded ID for announcement story type
        // @todo do some magic to make this dynamic
        "field_story_type.tid": 8
      },
      sort: "-promote",
      page: {
        limit: 3
      }
    });
    const announcements = await app.$axios.$get(
      `/api/node/basic_page?${announcementRequestParams}`
    );
    store.commit("updateAnnouncements", {
      title: "Announcements",
      announcements: _.map(announcements.data, announcement => {
        return {
          body:
            _.get(announcement, "attributes.body.summary", null) ||
            _.get(announcement, "attributes.body.processed", null),
          date: _.get(announcement, "attributes.changed", null),
          link: _.get(announcement, "attributes.path.alias", null)
        };
      })
    });
    store.commit("toggleSubMenu", false);
  }
};
</script>
