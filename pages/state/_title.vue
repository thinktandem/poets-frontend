<template>
  <div>
    <b-container class="py-5">
      <h1
        v-if="title"
        class="state__name pb-3">
        {{ title }}
      </h1>
      <b-row>
        <b-col md="7">
          <div
            class="state__body"
            v-if="body"
            v-html="body.processed"/>
        </b-col>
        <b-col
          md="4"
          offset-md="1">
          <states-jump-list-block/>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-row class="state__body">
        <b-col
          class="state__listings"
          md="12">
          <h3 class="state__listings-title">
            recent & featured listings
          </h3>
          <app-listing
            class="border-bottom"
            resource-type="listing"
            stacked="md"
            :paged="true"
            :default-params="defaultParams"
            :includes="includes"
            :filters="filters"
            :fields="fields"/>
        </b-col>
      </b-row>
      <b-row class="state__plaureaute-container">
        <b-col
          md="9"
          v-if="pLName"
          class="state__plaureaute">
          <div class="state__plaureaute-title">{{ title }} poet laureaute</div>
          <div class="state__plaureaute-name">
            {{ pLName }}
          </div>
          <div
            v-if="pLBody"
            class="state__plaureaute-body"
            v-html="pLBody"/>
        </b-col>
        <b-col
          class="state__plaureate-image-container"
          md="3">
          <b-img-lazy
            v-if="pLImage"
            class="state__plaureaute-image"
            :alt="pLImage.alt"
            :src="pLImage.src"/>
        </b-col>
      </b-row>
    </b-container>
    <CardDeck
      v-if="relatedPoets"
      title="Related Poets"
      cardtype="Poet"
      :cards="relatedPoets"/>
    <CardDeck
      v-if="relatedPoems"
      col-size="md"
      class="bg-primary py-5"
      title="Related Poems"
      cardtype="PoemCard"
      :cards="relatedPoems"/>
  </div>
</template>

<script>
import _ from "lodash";
import CardDeck from "~/components/CardDeck";
import AppListing from "~/components/AppListing";
import MetaTags from "~/plugins/metatags";
import StatesJumpListBlock from "~/components/StatesJumpListBlock";
export default {
  components: {
    CardDeck,
    AppListing,
    StatesJumpListBlock
  },
  head() {
    return MetaTags.renderTags(
      this.$route,
      this.state.attributes.metatag_normalized
    );
  },
  data() {
    return {
      busy: true,
      includes: {
        field_listingtype: "name",
        field_state: "title"
      },
      fields: {
        field_listingtype: { label: "Type" },
        title: { label: "Name" },
        field_state: { label: "State" }
      },
      defaultParams: {
        filter: {
          status: 1
        },
        page: {
          limit: 10
        }
      },
      // This is if you want searchable results on the page
      // not for filtering the query.
      filters: []
    };
  },
  async asyncData({ app, params }) {
    return app.$axios
      .$get(`/router/translate-path?path=/state/${params.title}`)
      .catch(err => {
        app.handleError(err);
      })
      .then(async res => {
        return app.$axios.get(
          `/api/node/state/${res.entity.uuid}` +
            `?include=field_laureaute_biography,
            field_laureaute_biography.field_image`
        );
      })
      .then(async res => {
        const pLName = _.get(res, "data.included[0].attributes.title", null);
        const pLBody = _.get(
          res,
          "data.included[0].attributes.body.processed",
          null
        );
        const pLImage = _.get(res, "data.included[0]", null)
          ? app.$buildImg(
              res.data,
              res.data.included[0],
              "field_image",
              "poem_a_day_portrait"
            )
          : null;

        let relatedPoets = null;
        relatedPoets = await app.$axios
          .get("/api/node/person", {
            params: {
              filter: {
                status: 1,
                field_p_type: "poet",
                state: {
                  condition: {
                    path: "field_state.id",
                    operator: "=",
                    value: res.data.data.id
                  }
                }
              },
              page: {
                limit: 3
              },
              sort: "-field_featured",
              include: "field_image"
            }
          })
          .then(res => {
            return {
              rows: _.map(_.get(res, "data.data"), row => {
                return {
                  name: _.get(row, "attributes.title", null),
                  bio:
                    _.get(row, "attributes.body.summary", null) ||
                    _.get(row, "attributes.body.processed", null) ||
                    "",
                  img: app.$buildImg(res.data, row, "field_image", "portrait"),
                  link: _.get(row, "attributes.path.alias")
                };
              })
            };
          })
          .catch(error => {
            console.error(error);
          });

        let relatedPoems = null;
        relatedPoems = await app.$axios
          .get("/api/node/poems", {
            params: {
              include: "field_author",
              filter: {
                status: 1,
                state: {
                  condition: {
                    path: "field_state.id",
                    operator: "=",
                    value: res.data.data.id
                  }
                }
              },
              page: {
                limit: 3
              },
              sort: "-field_featured"
            }
          })
          .then(res => {
            let poems = [];
            _.each(res.data.data, (poem, i) => {
              let author = null;
              _.each(res.data.included, person => {
                if (person.id === poem.relationships.field_author.data[0].id) {
                  author = _.get(person, "attributes.title");
                }
              });
              poems[i] = {
                link: _.get(poem, "attributes.path.alias"),
                title: _.get(poem, "attributes.title"),
                text: _.get(poem, "attributes.body.processed"),
                year: _.get(poem, "attributes.field_copyright_date").split(
                  "-"
                )[0],
                poet: {
                  name: author
                }
              };
            });
            return poems;
          })
          .catch(error => {
            console.error(error);
          });

        return {
          state: _.get(res, "data.data", null),
          title: _.get(res, "data.data.attributes.title", null),
          body: _.get(res, "data.data.attributes.body", null),
          pLName,
          pLBody,
          pLImage,
          relatedPoets:
            relatedPoets && relatedPoets.rows.length ? relatedPoets.rows : null,
          relatedPoems,
          defaultParams: {
            filter: {
              status: 1,
              "field_state.id": _.get(res, "data.data.id")
            }
          }
        };
      })
      .catch(error => {
        console.error(error);
      });
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.state__body {
  margin-top: 26px;
  font-weight: 400;
  font-size: 1.2em;
  .state__body-content {
    padding-right: 36px;
  }
}
div /deep/ .card-deck.bg-primary {
  background-color: var(--white) !important;
}
.card-deck.card-deck--poet {
  padding-top: 36px;
}
.state__listings {
  margin-bottom: 2.5rem;
}
.state__plaureaute-container {
  padding-bottom: 1rem;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--gray-600);
}
.state__plaureaute {
  .state__plaureaute-title {
    font-weight: 600;
    text-transform: lowercase;
  }
  .state__plaureaute-name {
    font-size: 2rem;
  }
}
.state__plaureaute-body {
  font-weight: 400;
  font-size: 1.1rem;
}
.state__plaureate-image-container {
  text-align: center;
}
.state__plaureaute-image {
  max-height: 246px;
}
</style>
