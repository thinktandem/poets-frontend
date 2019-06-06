<template>
  <div>
    <b-container class="pt-5">
      <b-row>
        <b-col
          class="pb-5"
          :offset-md="embedded ? null : 1"
          :md="embedded ? 12 : 7"
        >
          <b-card
            tag="main"
            header-class="pb-2 pt-3 bg-white"
            footer-class="bg-white"
            class="card--main"
          >
            <div
              class="px-0 mx-0"
              v-if="showSoundCloud"
              v-html="replaceFileUrl(poem.attributes.field_soundcloud_embed_code)"
            />
            <div slot="header">
              <div class="d-flex poem__title mb-1">
                <h1
                  v-if="embedded"
                  class="card-title"
                >
                  <b-link
                    v-if="poem && poem.attributes.path.alias && poem.attributes.path.title"
                    class="text-dark"
                    :to="poem.attributes.path.alias"
                  >{{ poem.attributes.title }}</b-link>
                </h1>
                <h1
                  v-else
                  :class="['card-title', {'card-title--long': longTitle}]"
                >{{ poem.attributes.title }}</h1>
                <b-link
                  @click="showSoundCloud = true"
                  v-if="showSoundCloud === false && null !== poem.attributes.field_soundcloud_embed_code"
                >
                  <speaker-icon class="poem__soundcloud-link" />
                </b-link>
                <b-link
                  @click="showSoundCloud = false"
                  v-if="showSoundCloud == true"
                >
                  <span class="poem__soundcloud-link">&#10005;</span>
                </b-link>
              </div>
              <span
                class="card-subtitle"
                v-if="poet !== null"
              >
                <b-link
                  v-if="poet && poet.path.alias"
                  :to="poet.path.alias">{{ poet.title }}</b-link>
                <span
                  class="dates"
                  v-if="poet && poet.field_dob"
                > - {{ niceDate(poet.field_dob, "year") }}-{{ niceDate(poet.field_dod, "year") }}</span>
              </span>
            </div>
            <poem-actions
              orientation="vertical"
              :poem="{ alias: poem.attributes.path.alias, title: poem.attributes.title, id: poem.id }"
            />
            <div
              class="poem__body px-md-4 font-serif"
              :class="{'poem__body--small-text': smalltext}"
              v-if="poem && poem.attributes.body !== null"
              v-html="replaceFileUrl(poem.attributes.body.processed)"
            />
            <div
              slot="footer"
              v-if="poem.attributes.field_credit !== null"
              class="card--poem__attribution text-muted-dark font-sans p-3"
              v-html="replaceFileUrl(poem.attributes.field_credit.processed)"
            />
          </b-card>
        </b-col>
        <b-col
          v-if="!embedded"
          md="4"
          tag="aside"
        >
          <div
            class="poet--aside px-4"
            v-if="poet !== null"
          >
            <div
              v-if="image"
              class="poet--aside__image"
            >
              <b-img
                fluid
                :src="image.src"
                :alt="image.alt"
              />
            </div>
            <div
              v-html="replaceFileUrl(poet.body.summary)"
              v-if="poet && poet.body"
              class="poet--aside__bio text-dark-muted my-3"
            />
            <div class="mb-4">
              <b-link
                v-if="poet"
                :to="poet.path.alias">More {{ poet.title }} ></b-link>
            </div>
          </div>
          <signup-block />
          <section
            class="py-4 about-poem text-dark-muted"
            v-if="poem.attributes.field_about_this_poem"
          >
            <h4>About This Poem</h4>
            <div v-html="replaceFileUrl(poem.attributes.field_about_this_poem.processed)" />
          </section>
        </b-col>
      </b-row>
    </b-container>
    <card-deck
      v-if="poet && morePoems !== [] && morePoems.poems.length >= 1 && !embedded"
      col-size="md"
      :title="`More by ${poet.title}`"
      cardtype="PoemCard"
      class="py-5"
      :link="buildSectionLink(morePoems.response, { field_author: poet.uuid })"
      :cards="morePoems.poems"
    />
    <card-deck
      col-size="md"
      v-if="relatedPoems.poems.length >= 1 && !embedded"
      title-class="text-white"
      class="bg-dark py-5"
      title="Related Poems"
      cardtype="PoemCard"
      :cards="relatedPoems.poems"
    />
  </div>
</template>

<script>
import qs from "qs";
import _ from "lodash";
import MetaTags from "~/plugins/metatags";
import niceDate from "~/plugins/niceDate";
import SpeakerIcon from "~/node_modules/open-iconic/svg/volume-high.svg";
import CardDeck from "~/components/CardDeck";
import SignupBlock from "~/components/SignupBlock";
import PoemActions from "~/components/PoemActions";

export default {
  components: {
    SignupBlock,
    CardDeck,
    PoemActions,
    SpeakerIcon
  },
  beforeRouteLeave(to, from, next) {
    if (this.embedded && _.get(to, "query.mbd") !== "1") {
      const where = _.merge({}, to, { query: { mbd: "1" } });
      next(where);
    } else {
      next();
    }
  },
  layout({ route }) {
    return _.get(route.query, "mbd") === "1" ? "embed" : "default";
  },
  data() {
    return {
      showSoundCloud: false
    };
  },
  head() {
    return MetaTags.renderTags(
      this.$route,
      this.poem.attributes.metatag_normalized,
      [
        {
          hid: "og:image",
          name: "og:image",
          content: this.socialImage
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: this.socialImage
        }
      ]
    );
  },
  async asyncData({ app, params, env }) {
    return app.$axios
      .$get(`/router/translate-path?path=/poem/${params.title}`)
      .catch(err => {
        app.handleError(err);
      })
      .then(async res =>
        app.$axios.$get(
          `/api/node/poems/${
            res.entity.uuid
          }?include=field_author.field_image,field_related_poems,field_related_poems.field_author`
        )
      )
      .then(async response => {
        const poet = _.find(
          _.get(response, "included"),
          include =>
            _.get(include, "id") ===
            _.get(
              _.first(_.get(response, "data.relationships.field_author.data")),
              "id"
            )
        );
        const relatedPoems = _.filter(
          _.get(response, "included"),
          include => include.type === "node--poems"
        );
        // We need a var to store the Author.
        let relatedAuthor = "";
        const morePoemParams = qs.stringify({
          page: {
            limit: 3
          },
          filter: {
            // Only published
            status: 1,
            // NOT the current poem
            id: {
              operator: "NOT IN",
              value: _.get(response, "data.id")
            },
            // Author is this poem's author
            "field_author.id": _.get(poet, "id")
          }
        });

        const morePoems = await app.$axios.$get(
          `/api/node/poems?${morePoemParams}`
        );
        return {
          poem: _.get(response, "data"),
          poet: _.get(poet, "attributes"),
          image: app.$buildImg(
            response,
            poet,
            "field_image",
            "poem_a_day_portrait"
          ),
          socialImage: app.$buildImg(
            response,
            poet,
            "field_image",
            "social_share"
          ).src,
          morePoems: {
            poems: _.map(morePoems.data, poem => {
              let crDate = _.get(poem, "attributes.field_copyright_date", null);
              return {
                link: _.get(poem, "attributes.path.alias"),
                title: _.get(poem, "attributes.title"),
                text: _.get(poem, "attributes.body.processed"),
                year: crDate ? crDate.split("-")[0] : null,
                poet: {
                  name: _.get(poet, "attributes.title")
                }
              };
            })
          },
          relatedPoems: {
            poems: _.map(relatedPoems, poem => {
              const poemAuthorId = _.get(
                poem,
                "relationships.field_author.data[0].id"
              );
              _.each(response.included, (inc, i) => {
                if (_.get(inc, "id") === poemAuthorId) {
                  relatedAuthor = inc.attributes.title;
                }
              });
              return {
                relatedAuthor,
                link: _.get(poem, "attributes.path.alias"),
                title: poem.attributes.title,
                text: _.get(poem, "attributes.body.processed"),
                year: _.get(poem, "attributes.field_copyright_date").split(
                  "-"
                )[0],
                poet: {
                  name: relatedAuthor
                }
              };
            })
          }
        };
      });
  },
  async fetch({ app, store, params, route, menu }) {
    // Set the current hero
    store.commit("updateHero", {
      variant: "default",
      heading: "Poems",
      lead: "Find and share the perfect poems.",
      links: [{ to: { name: "vertical-poem" }, text: "find poems" }]
    });
  },
  computed: {
    embedded() {
      return _.get(this.$route.query, "mbd") === "1";
    },
    longTitle() {
      return this.$data.poem.attributes.title.length > 75;
    },
    smalltext() {
      return _.get(this.$data, "poem.attributes.very_long_lines", false);
    }
  },
  methods: {
    buildSectionLink(response, query = {}) {
      return _.has(response, "meta.count") && response.meta.count > 3
        ? {
            to: {
              name: "vertical-poem",
              query: query
            },
            text: `${response.meta.count} Poems`
          }
        : null;
    },
    niceDate(date, format) {
      return niceDate.niceDate(date, format);
    }
  }
};
</script>

<style scoped lang="scss">
.dates {
  font-weight: 400;
}
.poem__title {
  flex-direction: row;
  justify-content: space-between;
}

.poem__soundcloud-link {
  color: var(--blue-dark);
  fill: var(--blue-dark);
  font-size: 1.9rem;
  width: 1.9rem;
  height: 1.9rem;
}

.card--main {
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05), 0 4px 0 0 #32d17e;

  .card-header {
    padding-left: 3.25rem;
  }

  .card-title {
    font-size: 2.5rem;
    line-height: 3rem;

    &.card-title--long {
      font-size: 2rem;
    }
  }

  .card-subtitle {
    font-family: $font-family-sans-serif;
    font-size: 1.25rem;
    line-height: 1.4;
    color: var(--black);
  }

  .card-body {
    font-size: 1.25rem;
    line-height: 1.5;
    font-family: $font-family-serif;
  }
  .card--poem__attribution {
    font-size: 0.8rem;
    line-height: 1.56;
    font-weight: 400;
  }
}

.poet--aside__image {
  border-bottom: 5px solid $green;
  img {
    width: 100%;
  }
}
.poet--aside__bio,
.about-poem {
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.18;
}
@include media-breakpoint-up(md) {
  .poem__actions {
    left: -3rem;
  }
}
</style>
