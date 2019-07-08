<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="8">
          <h1 class="poet__name">
            {{ title }}
          </h1>
          <div
            class="poet__dob-dod"
            v-if="dob">
            {{ niceDate(dob, "year") }}&#8211;{{ niceDate(dod, "year") }}
          </div>
        </b-col>
      </b-row>
      <b-row class="poet__body">
        <b-col md="8">
          <div
            v-if="body"
            class="poet__body-content"
            v-html="replaceFileUrl(body.processed)"/>
          <b-row
            class="person__related-texts-rows"
            md="8">
            <b-container
              class="books-list tabular-list">
              <b-row class="py-5">
                <b-col>
                  <app-listing
                    title="Texts"
                    hide-empty
                    class="py-3"
                    :default-params="defaultParams"
                    :fields="fields"
                    :includes="includes"
                    resource-type="texts"/>
                  <app-listing
                    title="Collections"
                    hide-empty
                    class="py-3"
                    :default-params="defaultParams"
                    :fields="fields"
                    :includes="includes"
                    resource-type="collections"/>
                  <app-listing
                    title="Lesson Plans"
                    hide-empty
                    class="py-3"
                    :default-params="defaultParams"
                    :fields="fields"
                    :includes="includes"
                    resource-type="lesson_plans"/>
                </b-col>
              </b-row>
            </b-container>
          </b-row>
        </b-col>
        <b-col
          class="poet__sidebar"
          md="4">
          <div>
            <figure>
              <b-img-lazy
                v-if="sideBarImage"
                fluid
                center
                class="poet__image"
                :src="sideBarImage.src"
                :alt="sideBarImage.alt"/>
              <figcaption v-if="sideBarImage">
                {{ sideBarImage.title }}
              </figcaption>
            </figure>
          </div>
          <div
            class="poet__related_schools_movements"
            v-if="schoolsMovements && schoolsMovements.length != 0">
            <span class="schools">Related Schools & Movements:</span>
            <div
              class="school"
              v-for="school in schoolsMovements"
              :key="school.name">
              {{ school.attributes.name }}
            </div>
          </div>
          <div
            class="poet__tags"
            v-if="tags && tags.length != 0">
            <span class="tags">Tags:</span>
            <div
              class="tag"
              v-for="tag in tags"
              :key="tag.name">
              {{ tag.attributes.name }}
            </div>
          </div>
          <div class="poet__read-poems">
            <b-button
              v-if="poemsByLink"
              block
              :href="poemsByLink.to"
              variant="outline-info">
              Read poems by this poet
            </b-button>
          </div>
          <div class="poet__read-texts">
            <b-button
              block
              :href="textsByLink"
              variant="outline-info">
              Read texts about this poet
            </b-button>
          </div>
          <div
            v-if="sideBarVid"
            class="poet__vid">
            <div
              class="poet__vid-title"
              v-html="sideBarVid[0].attributes.title"/>
            <div
              class="poet__vid-video"
              v-html="sideBarVid[0].attributes.body.value"/>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <CardDeck
      v-if="poemsBy"
      col-size="md"
      class="bg-primary py-5"
      title="By This Poet"
      cardtype="PoemCard"
      :cards="poemsBy"
      :link="poemsByLink"/>
    <CardDeck
      v-if="relatedPoets"
      title="Related Poets"
      cardtype="Poet"
      :cards="relatedPoets"/>
  </div>
</template>

<script>
import _ from "lodash";
import qs from "qs";
import AppListing from "~/components/AppListing";
import MetaTags from "~/plugins/metatags";
import niceDate from "~/plugins/niceDate";
import CardDeck from "~/components/CardDeck";

export default {
  components: {
    AppListing,
    CardDeck
  },
  computed: {
    defaultParams() {
      return {
        filter: {
          "field_contributors.id": _.get(this, "poet.id")
        }
      };
    },
    embedded() {
      return _.get(this.$route.query, "mbd") === "1";
    }
  },
  layout({ route }) {
    return _.get(route.query, "mbd") === "1" ? "embed" : "default";
  },
  beforeRouteLeave(to, from, next) {
    if (this.embedded && _.get(to, "query.mbd") !== "1") {
      const where = _.merge({}, to, { query: { mbd: "1" } });
      next(where);
    } else {
      next();
    }
  },
  data() {
    return {
      fields: {
        field_date_published: {
          label: "Year"
        },
        title: { label: "Title" }
      },
      includes: {},
      sort: "field_date_published",
      size: [[375, 0], [300, 250]]
    };
  },
  head() {
    return MetaTags.renderTags(
      this.$route,
      this.poet.attributes.metatag_normalized,
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
  async asyncData({ app, params, error }) {
    return app.$axios
      .$get(`/router/translate-path?path=/poet/${params.title}`)
      .catch(err => {
        if (err.response.status === 404) {
          error({ statusCode: 404, message: "" });
        }
      })
      .then(async res => {
        return app.$axios.get(
          `/api/node/person/${
            res.entity.uuid
          }?include=field_image,field_school_movement,field_poet_tags,field_media_selector`
        );
      })
      .then(async res => {
        const sideBarImage = app.$buildImg(
          res.data,
          null,
          "field_image",
          "poem_a_day_portrait"
        );
        const schoolsMovements = _.filter(res.data.included, {
          type: "taxonomy_term--school_movement"
        });
        const tags = _.filter(res.data.included, {
          type: "taxonomy_term--tags"
        });
        const sideBarVid = _.filter(_.get(res, "data.included"), {
          type: "paragraph--media"
        });
        const poemsByParams = qs.stringify({
          page: {
            limit: 3
          },
          filter: {
            status: 1,
            "field_author.id": res.data.data.id
          }
        });
        const poemsBy = await app.$axios.$get(
          `/api/node/poems?${poemsByParams}`
        );
        let relatedPoets = null;
        if (schoolsMovements.length > 0) {
          relatedPoets = await app.$axios
            .get("/api/node/person", {
              params: {
                filter: {
                  status: 1,
                  field_p_type: "poet",
                  id: {
                    operator: "<>",
                    value: res.data.data.id
                  },
                  schools: {
                    condition: {
                      path: "field_school_movement.id",
                      operator: "=",
                      value: schoolsMovements[0].id
                    }
                  }
                },
                page: {
                  limit: 6
                },
                sort: "-field_featured",
                include: "field_image"
              }
            })
            .then(res => {
              return {
                res,
                rows: _.map(_.get(res, "data.data"), row => {
                  return {
                    row,
                    name: _.get(row, "attributes.title", null),
                    bio:
                      _.get(row, "attributes.body.summary", null) ||
                      _.get(row, "attributes.body.processed", null) ||
                      "",
                    img: app.$buildImg(
                      res.data,
                      row,
                      "field_image",
                      "portrait"
                    ),
                    link: _.get(row, "attributes.path.alias")
                  };
                })
              };
            })
            .catch(error => {
              console.error(error);
            });
        }

        return {
          poet: res.data.data,
          socialImage: _.get(
            app.$buildImg(res.data, null, "field_image", "social_share"),
            "src"
          ),
          dob: _.get(res, "data.data.attributes.field_dob"),
          dod: _.get(res, "data.data.attributes.field_dod"),
          title: _.get(res, "data.data.attributes.title"),
          body: _.get(res, "data.data.attributes.body"),
          sideBarImage,
          sideBarVid: _.get(sideBarVid[0], "attributes.body", null)
            ? sideBarVid
            : null,
          schoolsMovements,
          tags,
          poemsBy: _.map(poemsBy.data, poem => {
            let crDate = _.get(poem, "attributes.field_copyright_date", null);
            return {
              link: _.get(poem, "attributes.path.alias"),
              title: _.get(poem, "attributes.title"),
              text: _.get(poem, "attributes.body.processed"),
              year: crDate ? crDate.split("-")[0] : null,
              poet: {
                name: _.get(res, "data.data.attributes.title")
              }
            };
          }),
          poemsByLink: {
            to: `/poems/${params.title}`,
            text: poemsBy.meta.count
          },
          textsByLink: `/texts/${params.title}`,
          relatedPoets:
            relatedPoets && relatedPoets.rows.length ? relatedPoets.rows : null
        };
      })
      .catch(error => {
        console.error(error);
      });
  },
  async fetch({ app, store, params, route, menu }) {
    return app.$buildBasicPage(app, store, "/poets");
  },
  methods: {
    niceDate(dateString, format) {
      return niceDate.niceDate(dateString, format);
    }
  }
};
</script>

<style scoped lang="scss">
.poet__dob-dod {
  font-weight: 400;
}
.poet__body {
  margin-top: 26px;
  font-weight: 400;
  font-size: 1.2em;
  .poet__body-content {
    padding-right: 36px;
  }
}
.poet__image {
  box-shadow: 0 6px 0 0 #32d17e;
}
@include media-breakpoint-up(md) {
  .col-md-4.poet__sidebar {
    position: relative;
    top: -94px;
  }
}
.poet__related_schools_movements,
.poet__tags {
  font-weight: 600;
  margin-top: 11px;
  margin-bottom: 11px;
  .school,
  .tag {
    padding-left: 9px;
    font-weight: 400;
  }
}
.poet__read-poems,
.poet__read-texts {
  margin: 4px;
  .btn-outline-info {
    color: var(--primary);
    border-color: var(--primary);
  }
  .btn-outline-info:hover {
    color: var(--white);
    background-color: var(--blue-dark);
  }
}
.poet__vid {
  padding-top: 11px;
}
div /deep/ .card-deck.bg-primary {
  background-color: var(--white) !important;
}
.card-deck.card-deck--poet {
  padding-top: 36px;
}
.person__related-texts-title {
  font-style: italic;
  font-family: "Poets Electra";
  font-size: 30px;
}
.tabular-list__header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
}
.tabular-list__row > div {
  height: inherit;
}
.tabular-list .tabular-list__row > div:last-child {
  text-align: left;
}
.date {
  color: var(--red-dark);
}
.books-list__books-title {
  min-height: 88px;
}
.books-list__books-title a {
  color: var(--gray-800);
  font-weight: 560;
}
.books-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
</style>
