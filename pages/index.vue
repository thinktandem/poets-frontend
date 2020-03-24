<template>
  <div>
    <daily-poem
      :poem="pad.poem"
      :poet="pad.poet"/>
    <app-card-columns
      promo
      title="Poems"
      :cards="$store.state.featuredPoems.cards"
      :count="parseInt($store.state.featuredPoems.count)"/>
    <card-deck
      class="py-5"
      title="Poets"
      col-size="md"
      :link="$store.state.featuredPoets.link"
      cardtype="Poet"
      :cards="$store.state.featuredPoets.poets"
      ad="true"
      position="5"/>
    <feature-stack
      v-if="$store.state.featuredContent && $store.state.featuredContent.length >= 1"
      :features="$store.state.featuredContent"
      title="Features"/>
    <app-announcements-awards />
    <product-feature
      v-if="latest.title"
      :title="latest.title"
      :sub-title="latest.subTitle"
      :intro="latest.intro"
      :contents="latest.contents"
      :img="latest.img"
      :link="latest.link"/>
  </div>
</template>

<script>
import _ from "lodash";
import qs from "qs";

import MetaTags from "~/plugins/metatags";
import niceDate from "~/plugins/niceDate";

import AppAnnouncementsAwards from "~/components/AppAnnouncementsAwards/AppAnnouncementsAwards";
import AppCardColumns from "~/components/AppCardColumns";
import CardDeck from "~/components/CardDeck";
import DailyPoem from "~/components/Poems/DailyPoem";
import FeatureStack from "~/components/FeatureStack";
import ProductFeature from "~/components/ProductFeature";

// Query to get featured poems
const featuredPoemsQuery = {
  query: {
    page: {
      limit: 4
    },
    sort: "-promote",
    include: "field_author"
  }
};

// Query to get featured poets
const featuredPoetsQuery = {
  query: {
    sort: "-promote,-field_image.fid",
    page: {
      limit: 6
    }
  }
};

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
    let meta = MetaTags.renderTags(this.$route, this.$store.state.metatags);
    meta["script"].push({ src: "https://powerad.ai/script.js" });
    return meta;
  },
  data() {
    return {
      latest: {},
      pad: {
        poem: {},
        poet: {
          image: ""
        }
      }
    };
  },
  mounted() {
    Promise.all([
      this.getPoemADay(),
      this.getFeaturedPoems(),
      this.getFeaturedPoets(),
      this.getAnnouncements(),
      this.getLatestMagazine()
    ]);
  },
  methods: {
    getPoemADay() {
      this.$api
        .getPoemADay()
        .then(response => _.get(response, "data[0]", []))
        .then(pad => {
          this.pad = {
            poet: {
              name: _.get(pad, "poet.name"),
              image: _.get(pad, "poet.image"),
              alias: _.get(pad, "poet.alias")
            },
            poem: {
              title: _.get(pad, "poem.title"),
              text: _.get(pad, "poem.text"),
              soundCloud: _.get(pad, "poem.soundcloud"),
              alias: _.get(pad, "poem.alias"),
              id: _.get(pad, "poem.uuid", null),
              about: _.get(pad, "poem.about", null)
            }
          };
        });
    },
    getFeaturedPoems() {
      this.$api.getPoems(featuredPoemsQuery).then(poems => {
        const featuredPoems = _.get(poems, "data", {});
        this.$store.commit("updateFeaturedPoems", {
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
      });
    },
    getFeaturedPoets() {
      this.$api.getFeaturedPoets(featuredPoetsQuery).then(poets => {
        const featuredPoets = _.get(poets, "data", {});
        if (featuredPoets.data.length >= 1) {
          this.$store.commit("updateFeaturedPoets", {
            poets: _.map(featuredPoets.data, poet => ({
              name: _.get(poet, "attributes.title", null),
              img: this.$buildImg(
                featuredPoets,
                poet,
                "field_image",
                "portrait",
                {
                  src: "/images/default-person.png",
                  alt: _.get(poet, "attributes.title") + " portrait"
                }
              ),
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
      });
    },
    getAnnouncements() {
      const announcementRequestParams = qs.stringify({
        filter: {
          // Hard coded ID for announcement story type
          // @todo do some magic to make this dynamic
          "field_story_type.tid": 8,
          promote: 1
        },
        sort: "-created",
        page: {
          limit: 3
        }
      });
      this.$axios
        .$get(`/api/node/basic_page?${announcementRequestParams}`)
        .then(announcements => {
          this.$store.commit("updateAnnouncements", {
            title: "Announcements",
            announcements: _.map(
              _.get(announcements, "data", []),
              announcement => {
                return {
                  body:
                    _.get(announcement, "attributes.body.summary", null) ||
                    _.get(announcement, "attributes.body.processed", null),
                  date: niceDate.niceDate(
                    _.get(announcement, "attributes.created", null)
                  ),
                  link: _.get(announcement, "attributes.path.alias", null)
                };
              }
            )
          });
        });
    },
    getLatestMagazine() {
      this.$api.getLatestMagazine().then(magazine => {
        this.latest = this.$latestMagazine(_.get(magazine, "data"));
      });
    }
  },
  async fetch({ app, store, params, route, menu }) {
    store.commit("toggleSubMenu", false);
    return app.$buildBasicPage(app, store, "/home");
  }
};
</script>
