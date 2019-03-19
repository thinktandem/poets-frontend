<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="8">
          <h1 class="poet__name">
            {{ title }}
          </h1>
          <div class="poet__dob-dod">
            {{ niceDate(dob, "year") }}&#8211;{{ niceDate(dod, "year") }}
          </div>
        </b-col>
      </b-row>
      <b-row class="poet__body">
        <b-col md="8">
          <div
            class="poet__body-content"
            v-html="body.processed"/>
        </b-col>
        <b-col
          class="poet__sidebar"
          md="4">
          <div class="poet__image">
            <figure>
              <b-img
                :src="sideBarImage.src"
                :alt="sideBarImage.alt"/>
              <figcaption v-if="sideBarImage.title">
                {{ sideBarImage.title }}
              </figcaption>
            </figure>
          </div>
          <div
            class="poet__related_schools_movements"
            v-if="schoolsMovements.length != 0">
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
            v-if="tags.length != 0">
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
              block
              :href="poemsByLink.to"
              variant="outline-info">
              Read poems by this poet
            </b-button>
          </div>
          <div class="poet__read-texts">
            <b-button
              block
              href="/texts"
              variant="outline-info">
              Read text by or about this poet
            </b-button>
          </div>
          <PromoSpace
            variant="transparent"
            dimensions="square"/>
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
import niceDate from "~/plugins/niceDate";
import CardDeck from "~/components/CardDeck";
import PromoSpace from "~/components/PromoSpace";

export default {
  components: {
    CardDeck,
    PromoSpace
  },
  data() {
    return {
      size: [[375, 0], [300, 250]]
    };
  },
  async asyncData({ app, params }) {
    return app.$axios
      .$get(`/router/translate-path?path=/poet/${params.title}`)
      .then(async res => {
        return app.$axios.get(
          `/api/node/person/${
            res.entity.uuid
          }?include=field_image,field_school_movement,field_poet_tags`
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
            .catch(err => {
              console.log(err);
            });
        }

        return {
          dob: res.data.data.attributes.field_dob,
          dod: res.data.data.attributes.field_dod,
          title: res.data.data.attributes.title,
          body: res.data.data.attributes.body,
          sideBarImage,
          schoolsMovements,
          tags,
          poemsBy: _.map(poemsBy.data, poem => {
            return {
              link: poem.attributes.path.alias,
              title: poem.attributes.title,
              text: poem.attributes.body.processed,
              year: poem.attributes.field_copyright_date.split("-")[0],
              poet: {
                name: res.data.data.attributes.title
              }
            };
          }),
          poemsByLink: {
            to: `/poems/${params.title}`,
            text: poemsBy.meta.count
          },
          relatedPoets:
            relatedPoets && relatedPoets.rows.length ? relatedPoets.rows : null
        };
      })
      .catch(err => {
        console.log(err);
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
  width: 311px;
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
div /deep/ .card-deck.bg-primary {
  background-color: var(--white) !important;
}
.card-deck.card-deck--poet {
  padding-top: 36px;
}
</style>
