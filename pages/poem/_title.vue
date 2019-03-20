<template>
  <div>
    <b-container class="pt-5">
      <b-row>
        <b-col
          class="pb-5"
          offset-md="1"
          md="7">
          <b-card
            tag="main"
            header-class="pb-2 pt-3 bg-white"
            footer-class="bg-white"
            class="card--main">
            <div
              class="px-0 mx-0"
              v-if="showSoundCloud"
              v-html="poem.attributes.field_soundcloud_embed_code"/>
            <div
              slot="header">
              <div class="d-flex poem__title mb-1">
                <h1 class="card-title">{{ poem.attributes.title }}</h1>
                <b-link
                  @click="showSoundCloud = true"
                  v-if="showSoundCloud === false && null !== poem.attributes.field_soundcloud_embed_code"
                >
                  <speaker-icon class="poem__soundcloud-link"/>
                </b-link>
                <b-link
                  @click="showSoundCloud = false"
                  v-if="showSoundCloud == true">
                  <span class="poem__soundcloud-link">&#10005;</span>
                </b-link>
              </div>
              <span
                class="card-subtitle"
                v-if="poet !== null">
                <b-link :to="poet.path.alias">{{ poet.title }}</b-link>
                <span
                  class="dates"
                > - {{ niceDate(poet.field_dob) }}-{{ niceDate(poet.field_dod) }}</span>
              </span>
            </div>
            <poem-actions
              orientation="vertical"
              :poem="{ alias: poem.attributes.path.alias, title: poem.attributes.title, id: poem.id }"/>
            <div
              class="px-md-4 font-serif-2"
              v-if="poem.attributes.body !== null"
              v-html="poem.attributes.body.processed"/>
            <div
              slot="footer"
              v-if="poem.attributes.field_credit !== null"
              class="card--poem__attribution text-muted-dark font-sans p-3"
              v-html="poem.attributes.field_credit.processed"
            />
          </b-card>
        </b-col>
        <b-col
          md="4"
          tag="aside">
          <div
            class="poet--aside px-4"
            v-if="poet !== null">
            <div
              v-if="image"
              class="poet--aside__image">
              <b-img
                fluid
                :src="image.src"
                :alt="image.alt"/>
            </div>
            <div
              v-html="poet.body.summary"
              class="poet--aside__bio text-dark-muted my-3"/>
            <div class="mb-4">
              <b-link :to="poet.path.alias">More {{ poet.title }} ></b-link>
            </div>
          </div>
          <signup-block/>
          <section
            class="py-4 about-poem text-dark-muted"
            v-if="poem.attributes.field_about_this_poem">
            <h4>About This Poem</h4>
            <div v-html="poem.attributes.field_about_this_poem.processed"/>
          </section>
        </b-col>
      </b-row>
    </b-container>
    <card-deck
      v-if="morePoems.poems.length >= 1"
      col-size="md"
      :title="`More by ${poet.title}`"
      cardtype="PoemCard"
      class="py-5"
      :link="buildSectionLink(morePoems.response, { field_author: poet.uuid })"
      :cards="morePoems.poems"
    />
    <card-deck
      col-size="md"
      v-if="relatedPoems.poems.length >= 1"
      class="bg-primary py-5"
      title="Related Poems"
      cardtype="PoemCard"
      :cards="relatedPoems.poems"
    />
  </div>
</template>

<script>
import * as qs from "qs";
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
  data() {
    return {
      showSoundCloud: false
    };
  },
  head() {
    return MetaTags.renderTags(this.poem.attributes.metatag_normalized);
  },
  async asyncData({ app, params, env }) {
    return app.$axios
      .$get(`/router/translate-path?path=/poem/${params.title}`)
      .then(async res =>
        app.$axios.$get(
          `/api/node/poems/${
            res.entity.uuid
          }?include=field_author.field_image,field_related_poems`
        )
      )
      .then(async response => {
        const poet = _.find(
          response.included,
          include =>
            _.get(include, "id") ===
            _.get(
              _.first(_.get(response, "data.relationships.field_author.data")),
              "id"
            )
        );
        const relatedPoems = _.filter(
          response.included,
          include => include.type === "node--poems"
        );
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
              value: response.data.id
            },
            // Author is this poem's author
            "field_author.id": poet.id
          }
        });

        const morePoems = await app.$axios.$get(
          `/api/node/poems?${morePoemParams}`
        );
        return {
          poem: response.data,
          poet: poet.attributes,
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
              return {
                link: poem.attributes.path.alias,
                title: poem.attributes.title,
                text: poem.attributes.body.processed,
                year: poem.attributes.field_copyright_date.split("-")[0],
                poet: {
                  name: poet.attributes.title
                }
              };
            })
          },
          relatedPoems: {
            poems: _.map(relatedPoems, poem => {
              return {
                link: poem.attributes.path.alias,
                title: poem.attributes.title,
                text: poem.attributes.body.processed,
                year: poem.attributes.field_copyright_date.split("-")[0],
                poet: {
                  name: poet.attributes.title
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
      heading: "Find Poems",
      lead:
        "Find the perfect poems, save them, and share them to your heart’s content.",
      links: [{ to: { name: "vertical-poem" }, text: "find poems" }]
    });
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
    niceDate(date) {
      return niceDate.niceDate(date);
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
  .card-title {
    font-size: 2.5rem;
  }

  .card-subtitle {
    font-family: $font-family-sans-serif;
    font-size: 1.25rem;
    line-height: 1.75rem;
    color: var(--black);
  }

  .card-body {
    font-size: 1.25rem;
    line-height: 1.87rem;
    font-family: $font-family-serif;
  }
  .card--poem__attribution {
    font-size: 0.8rem;
    line-height: 1.25rem;
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
  line-height: 1.07rem;
}
@include media-breakpoint-up(md) {
  .poem__actions {
    left: -3rem;
  }
}
</style>
