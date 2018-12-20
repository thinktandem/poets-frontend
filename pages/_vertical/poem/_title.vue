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
              v-html="poem.field_soundcloud_embed_code"/>
            <div
              slot="header">
              <div class="d-flex poem__title mb-1">
                <h1 class="card-title">{{ poem.title }}</h1>
                <b-link
                  @click="showSoundCloud = true"
                  v-if="showSoundCloud === false && null !== poem.field_soundcloud_embed_code"
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
                  v-if="poet.field_dob !== null"
                >- {{ poet.field_dob.split("-", 1)[0] }} - {{ poet.field_dod }}</span>
              </span>
            </div>
            <poem-actions
              orientation="vertical"
              :poem="{ alias: poem.path.alias, title: poem.title }"/>
            <div
              class="px-md-4 "
              v-if="poem.body !== null"
              v-html="poem.body.processed"/>
            <div
              slot="footer"
              v-if="poem.field_credit !== null"
              class="card--poem__attribution text-muted font-sans"
              v-html="poem.field_credit.processed"
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
              v-if="image !== null"
              class="poet--aside__image">
              <b-img
                fluid
                :src="image"/>
            </div>
            <div
              v-html="poet.body.summary"
              class="poet--aside__bio text-dark-muted my-3"/>
            <div class="mb-4">
              <b-link :to="poet.path.alias">More {{ poet.title }} ></b-link>
            </div>
          </div>
          <app-poem-a-day-sign-up-form/>
        </b-col>
      </b-row>
    </b-container>
    <card-deck
      v-if="morePoems.poems.length >= 1"
      :title="`More by ${poet.title}`"
      cardtype="PoemCard"
      :link="buildSectionLink(morePoems.response, { field_author: poet.uuid })"
      :cards="morePoems.poems"
    />
    <card-deck
      v-if="relatedPoems.poems.length >= 1"
      class="bg-primary"
      title="Related Poems"
      cardtype="PoemCard"
      :link="buildSectionLink(relatedPoems.response, {field_related_poems: poem.uuid })"
      :cards="relatedPoems.poems"
    />
  </div>
</template>

<script>
import AppPoemADaySignUpForm from "~/components/AppPoemADayPoems/AppPoemADaySignUpForm";
import AppPoems from "~/components/AppPoemADayPoems/AppPoems";
import SpeakerIcon from "~/node_modules/open-iconic/svg/volume-high.svg";
import CardDeck from "~/components/CardDeck";
import PoemActions from "~/components/PoemActions";
import * as qs from "qs";
import * as _ from "lodash";

export default {
  components: {
    AppPoemADaySignUpForm,
    AppPoems,
    CardDeck,
    PoemActions,
    SpeakerIcon
  },
  data() {
    return {
      showSoundCloud: false
    };
  },
  async asyncData({ app, params, env }) {
    // Build an alias path to query
    const routerQuery = qs.stringify({
      path: `${params.vertical}/poem/${params.title}`
    });

    const routerRequest = {
      requestId: "router",
      action: "view",
      uri: `/router/translate-path?${routerQuery}`
    };

    const poemParams = qs.stringify({
      fields: {
        "node--poems": [
          "title",
          "body",
          "field_author",
          "field_credit",
          "field_soundcloud_embed_code",
          "path"
        ]
      }
    });

    const poemRequest = {
      action: "view",
      requestId: "poem",
      uri: `{{router.body@$.jsonapi.individual}}?${poemParams}`,
      headers: {
        "Content-Type": "application/vnd.api+json"
      },
      waitFor: ["router"]
    };

    const poetParams = qs.stringify({
      fields: {
        "node--person": [
          "title",
          "body",
          "field_dob",
          "field_dod",
          "field_image",
          "path"
        ]
      }
    });

    const poetRequest = {
      action: "view",
      requestId: "poet",
      uri: `{{poem.body@$.data.relationships.field_author.links.related}}?${poetParams}`,
      headers: {
        "Content-Type": "application/vnd.api+json"
      },
      waitFor: ["poem"]
    };

    const imageRequest = {
      action: "view",
      requestId: "file",
      uri: "{{poet.body@$.data[0].relationships.field_image.links.related}}",
      headers: {
        "Content-Type": "application/vnd.api+json"
      },
      waitFor: ["poet"]
    };

    const morePoemParams = qs.stringify({
      page: {
        limit: 3
      },
      filter: {
        // Only published
        status: 1,
        // NOT the current poem
        uuid: {
          operator: "NOT IN",
          value: "{{poem.body@$.data.id}}"
        },
        // Author is this poem's author
        "field_author.uuid": "{{poet.body@$.data[0].id}}"
      }
    });

    const morePoemsRequest = {
      action: "view",
      requestId: "more_poems",
      uri: `/api/node/poems?${morePoemParams}`,
      headers: {
        "Content-Type": "application/vnd.api+json"
      },
      waitFor: ["poet"]
    };

    const relatedPoemsParams = qs.stringify({
      page: {
        limit: 3
      },
      filter: {
        status: 1
      }
    });

    const relatedPoemsRequest = {
      action: "view",
      requestId: "related_poems",
      uri: `{{poem.body@$.data.relationships.field_related_poems.links.related}}?${relatedPoemsParams}`,
      headers: {
        "Content-Type": "application/vnd.api+json"
      },
      waitFor: ["poem"]
    };

    return app.$axios
      .$post(
        "/subrequests",
        [
          routerRequest,
          poemRequest,
          poetRequest,
          imageRequest,
          morePoemsRequest,
          relatedPoemsRequest
        ],
        {
          params: {
            _format: "json"
          },
          headers: {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        const morePoemResponse = JSON.parse(response["more_poems#uri{0}"].body);
        const relatedPoemResponse = JSON.parse(
          response["related_poems#uri{0}"].body
        );
        return {
          poem: JSON.parse(response["poem#uri{0}"].body).data.attributes,
          poet: JSON.parse(response["poet#uri{0}"].body).data[0].attributes,
          image: _.has(
            JSON.parse(response["file#uri{0}"].body).data[0],
            "attributes"
          )
            ? `${env.baseURL}${
                JSON.parse(response["file#uri{0}"].body).data[0].attributes.url
              }`
            : null,
          morePoems: {
            response: morePoemResponse,
            poems: _.map(morePoemResponse.data, poem => {
              return {
                link: poem.attributes.path.alias,
                title: poem.attributes.title,
                text: poem.attributes.body.processed,
                year: poem.attributes.field_copyright_date.split("-")[0],
                poet: {
                  name: JSON.parse(response["poet#uri{0}"].body).data[0]
                    .attributes.title
                }
              };
            })
          },
          relatedPoems: {
            response: relatedPoemResponse,
            poems: _.map(relatedPoemResponse.data, poem => {
              return {
                link: poem.attributes.path.alias,
                title: poem.attributes.title,
                text: poem.attributes.body.processed,
                year: poem.attributes.field_copyright_date.split("-")[0],
                poet: {
                  name: JSON.parse(response["poet#uri{0}"].body).data[0]
                    .attributes.title
                }
              };
            })
          }
        };
      });
  },
  async fetch({ app, store, params }) {
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
    }
  }
};
</script>

<style scoped lang="scss">
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
  }
}

.poet--aside__image {
  border-bottom: 5px solid $green;
  img {
    width: 100%;
  }
}
.poet--aside__bio {
  font-size: 0.9rem;
  line-height: 1.07rem;
}
@include media-breakpoint-up(md) {
  .poem__actions {
    left: -3rem;
  }
}
</style>
