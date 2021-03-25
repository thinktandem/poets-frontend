<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="8">
          <h1 class="poet__name">
            {{ title }}
          </h1>
          <span
            class="poet__laureate-icon"
            v-if="laureateProjects.title">
            <poet-laureate-icon />
          </span>
          <div
            class="poet__dob-dod"
            v-if="dob">
            {{ niceDate(dob, "year") }}&#8211;{{ niceDate(dod, "year") }}
          </div>
          <div
            class="poet__laureate-container"
            v-if="laureateProjects.title">
            <div
              class="poet__laureate"
              v-if="laureateProjects.created != null">
              {{ laureateProjects.title }} {{ niceDate(laureateProjects.created, "year") }}
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="poet__read-buttons-container">
        <b-col
          class="poet__read-poems"
          md="4">
          <b-button
            class="
              poets__read-poems-button
              align-middle
              btn-primary"
            block
            href="#poet__works"
            variant="outline-info">
            read poems by this poet
          </b-button>
        </b-col>
      </b-row>
      <b-row class="poet__body">
        <b-col md="8">
          <div
            v-if="body"
            class="poet__body-content"
            v-html="replaceFileUrl(body.processed)"/>
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
              <figcaption
                class="poet__sidebar-img-caption"
                v-if="sideBarImage">
                {{ sideBarImage.title }}
              </figcaption>
            </figure>
          </div>
          <div
            class="poet__related_schools_movements"
            v-if="schoolsMovements && schoolsMovements.length != 0">
            <div class="schools">School/Movements</div>
            <div
              class="school"
              v-for="movement in schoolsMovements"
              :key="movement.name">
              <b-link :to="movementsPrefix + movement.attributes.drupal_internal__tid">
                {{ movement.attributes.name.toLowerCase() }}
              </b-link>
            </div>
          </div>
          <div
            class="poet__tags"
            v-if="tags && tags.length != 0">
            <div class="tags">Tags</div>
            <div
              class="tag"
              v-for="tag in tags"
              :key="tag.name">
              {{ tag.attributes.name }}
            </div>
          </div>
          <div
            class="poet__laureate-projects"
            v-if="laureateProjects.title">
            <div class="poet__laureate-projects-title">
              <div class="poet__sidebar-laureate-icon">
                <poet-laureate-icon />
              </div>
              <div class="laureate-projects">Poet Laureate Project</div>
            </div>
            <div class="project">
              <b-link :to="laureateProjects.link">
                {{ laureateProjects.title }}
              </b-link>
            </div>
          </div>
          <div
            class="poet__sidebar-related-poets"
            v-if="relatedPoets && relatedPoets.length > 0">
            <div class="poet__sidebar-related-poets-title">
              Related Poets
            </div>
            <div
              class="poet__sidebar-related-poets-poet"
              v-for="poet in relatedPoets"
              :key="poet.name">
              <b-link :to="poet.row.attributes.path.alias">
                {{ poet.row.attributes.title }}
              </b-link>
            </div>
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
    <app-poet-works
      id="poet__works"
      :poet="poet"/>
    <div
      class="lpi-container"
      v-if="laureateProjects.title"> 
      <div class="container">
        <div class="row">
          <div class="md-10">
            <div class="lpi-title font-serif font-italic py-2">
              Laureate Project
              <span>
                <poet-laureate-icon />
              </span>
            </div>
            <app-laureate-projects
              v-if="laureateProjects.title"
              title="Laureate Project"
              :features="laureateProjects"/>
          </div>
        </div>
      </div>
    </div>
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
import MetaTags from "~/plugins/metatags";
import niceDate from "~/plugins/niceDate";
import CardDeck from "~/components/CardDeck";
import AppPoetWorks from "~/components/Poets/AppPoetWorks";
import AppLaureateProjects from "~/components/AppLaureateProjects";
import PoetLaureateIcon from "~/static/icons/poet-laureate-icon.svg";

export default {
  components: {
    AppPoetWorks,
    AppLaureateProjects,
    CardDeck,
    PoetLaureateIcon
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
      size: [[375, 0], [300, 250]],
      movementsPrefix: "/poets?school="
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
        const laureateProjectsParams = qs.stringify({
          filter: {
            "field_winner.nid": _.get(
              res,
              "data.data.attributes.drupal_internal__nid"
            )
          }
        });
        const laureateProjects = await app.$axios.$get(
          `/api/node/sub_prize_or_program?${laureateProjectsParams}&include=field_image`
        );
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
          laureateProjects: {
            title: _.get(laureateProjects, "data[0].attributes.title", null),
            link: _.get(
              laureateProjects,
              "data[0].attributes.path.alias",
              null
            ),
            created: _.get(
              laureateProjects,
              "data[0].attributes.created",
              null
            ),
            lpi: _.get(laureateProjects, "included[0].attributes", null),
            blurb: _.get(laureateProjects, "data[0].attributes.body", null)
          },
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
    },
    lowerFirst(thing) {
      return _.lowerFirst(thing);
    }
  }
};
</script>

<style scoped lang="scss">
.poet__name {
  font-size: 3rem;
  display: inline-block;
}
.poet__laureate-icon {
  display: inline-block;
  margin-left: 0.4rem;
  height: 47px;
  svg {
    height: 3.3rem;
    vertical-align: bottom;
  }
  svg path {
    fill: #32d17e;
  }
}
.poet__dob-dod {
  font-size: 1.4rem;
  font-weight: 400;
}
.poet__laureate {
  color: #32d17e;
  font-size: 1.4rem;
}
.poet__read-buttons-container {
  padding-top: 1rem;
  padding-bottom: 1rem;
  .poet__read-poems,
  .poet__read-texts {
    .poets__read-poems-button,
    .poets__read-texts-button {
      font-size: 1.5rem;
      font-weight: 444;
    }
    .btn-outline-info {
      color: var(--white);
      border-color: var(--primary);
    }
    .btn-outline-info:hover {
      color: var(--primary);
      background-color: var(--white);
    }
  }
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
  margin: 0;
  width: 100%;
  box-shadow: 0 6px 0 0 #32d17e;
}
.poet__sidebar-img-caption {
  margin-top: 0.4rem;
}
@include media-breakpoint-up(md) {
  .col-md-4.poet__sidebar {
    position: relative;
    top: -94px;
  }
}
.poet__related_schools_movements,
.poet__tags {
  font-weight: 400;
  margin-top: 11px;
  margin-bottom: 11px;
  .schools,
  .tags {
    width: 100%;
    padding-bottom: 0.2rem;
    border-bottom: 1px #ccc solid;
  }
  .school,
  .tag {
    margin-top: 0.4rem;
    font-size: 1.2rem;
    font-weight: 500;
  }
}
.poet__sidebar-related-poets-title,
.poet__sidebar-related-poems-title,
.poet__laureate-projects-title {
  vertical-align: middle;
  display: inline-block;
  margin-top: 11px;
  margin-bottom: 11px;
  border-bottom: 1px #ccc solid;
  font-weight: 400;
}
.poet__sidebar-laureate-icon {
  display: inline-block;
  margin-right: 0.4rem;
  svg {
    padding-bottom: 0.2rem;
    height: 2.6rem;
    vertical-align: middle;
  }
  svg path {
    fill: #32d17e;
  }
}
.laureate-projects {
  display: inline-block;
}
.poet__sidebar-related-poems-poem,
.poet__sidebar-related-poets-poet,
.project {
  font-weight: 500;
  font-size: 1.2rem;
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
.person__related-content-tabs-poems,
.person__related-content-tabs-texts {
  .nav-link {
    font-family: "Founders Grotesk Text";
    font-size: 1.6rem !important;
    font-weight: 600;
  }
  .nav-link:active {
    border-bottom: 2px solid blue;
  }
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
.lpi-container {
  background-color: #f1f1f1;
  min-height: 444px;
  min-width: 100%;
  .lpi-title {
    margin-left: 2rem;
    font-size: 2.2rem;
    svg {
      height: 4rem;
      vertical-align: bottom;
    }
    svg path {
      fill: #32d17e;
    }
  }
}
</style>
