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
    <b-container class="py-5">
      <b-row>
        <b-col md="8">
          <app-announcements v-bind="$store.state.announcements"/>
        </b-col>
      </b-row>
    </b-container>
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
import AppAnnouncements from "~/components/AppAnnouncements";
export default {
  layout: "default",
  components: {
    AppAnnouncements,
    AppCardColumns,
    CardDeck,
    DailyPoem,
    FeatureStack,
    ProductFeature
  },
  async fetch({ app, store, params, route, menu }) {
    // @todo: We're counting on this path in Drupal, which might be something we want
    // to change.
    app.$buildBasicPage(app, store, "/home");

    // Override the hero with a quote on the homepage, this will overwrite
    // Drupal.
    store.commit("updateHero", {
      variant: "quote",
      lead:
        "Poetry offers us the capacity to carry in us and express the contradictory impulses that make us human.",
      subtext: "—Kwame Dawes, Academy of American Poets Chancellor (2018- )"
    });

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
            year: _.get(poem, "attributes/field_date_published")
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
        field_p_type: "poet",
        image: {
          path: "field_image.id",
          operator: "<>",
          value: ""
        }
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
          img: {
            src: _.get(
              _.find(
                featuredPoets.included,
                include =>
                  include.id ===
                  _.get(
                    _.first(poet.relationships.field_image.data),
                    "id",
                    null
                  )
              ),
              "links.portrait.href",
              ""
            ),
            alt: _.get(_.first(poet.relationships.field_image.data), "meta.alt")
          },
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
    const magazine = await app.$axios.$get(
      `/api/node/magazine?${magazineQuery}`
    );
    let img = _(magazine.included)
      .filter(include => include.type === "file--file")
      .first();
    const topProduct = _.first(magazine.data);
    store.commit("updateProductFeature", {
      title: _.get(topProduct, "attributes.title", null),
      intro: _.get(topProduct, "attributes.body.processed", null),
      subTitle: _.get(topProduct, "attributes.subtitle", null),
      contents: _.get(topProduct, "attributes.contents", null),
      img: {
        src: _.get(img, "links.magazine_cover.href"),
        alt: "Magazine Cover"
      },
      link: {
        to: `/academy-american-poets/become-member`,
        text: "Become a member"
      }
    });

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
