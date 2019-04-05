<template>
  <div>
    <BasicPage
      :page-data="$store.state.pageData"/>
    <div class="bg-white">
      <b-container class="py-5">
        <b-row>
          <b-col md="8">
            <div class="ttp__title">
              {{ title }}
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="8">
            <div
              class="ttp__body"
              v-html="body"/>
          </b-col>
          <b-col md="4">
            <div class="ttp__image-container">
              <b-img
                class="ttp__image"
                :src="imageUrl"
                :alt="imageMeta.alt"/>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <AppListing
      resource-type="teach_this_poem"
      :default-params="defaultParams"
      :includes="includes"
      :fields="fields"
      :details="details"
      :filters="filters"
      :searchable="searchable"/>
  </div>
</template>

<script>
import _ from "lodash";
import BasicPage from "~/components/BasicPage";
import AppListing from "~/components/AppListing";
import iconSearch from "~/static/icons/magnifying-glass.svg";
import MetaTags from "~/plugins/metatags";

export default {
  components: {
    BasicPage,
    AppListing,
    iconSearch
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  data() {
    return {
      includes: {},
      fields: {
        title: {
          label: "Name"
        },
        body: {
          label: "Description"
        }
      },
      details: {},
      defaultParams: {
        filter: {
          status: 1,
          id: {
            operator: "<>",
            value: ""
          }
        }
      },
      filters: [],
      searchable: [
        { field: "title", label: "name" },
        {
          field: "body.value",
          label: "text"
        }
      ]
    };
  },
  async asyncData({ app, params, query }) {
    const featuredTTP = await app.$axios
      .$get(`/api/node/teach_this_poem`, {
        params: {
          page: {
            limit: 1
          },
          filter: {
            status: 1,
            promote: 1
          },
          include: "field_side_image"
        }
      })
      .then(async res => {
        const image = await app.$axios
          .$get(
            `/api/file/file/${
              res.included[0].relationships.field_image.data.id
            }`
          )
          .then(async res => {
            return {
              imageUrl: res.data.links.portrait.href
            };
          })
          .catch(err => {
            console.log(err);
          });

        return {
          res,
          image,
          imageMeta: res.included[0].relationships.field_image.data.meta
        };
      })
      .catch(err => {
        console.log(err);
      });

    return {
      title: _.get(featuredTTP.res.data[0], "attributes.title", ""),
      body: _.get(featuredTTP.res.data[0], "attributes.body.value", ""),
      imageUrl: featuredTTP.image.imageUrl,
      imageMeta: featuredTTP.imageMeta,
      defaultParams: {
        filter: {
          status: 1,
          id: {
            operator: "<>",
            value: featuredTTP.res.data[0].id
          }
        }
      }
    };
  },
  async fetch({ app, store, route }) {
    return app.$buildBasicPage(app, store, "/teach-poem").then(async () => {});
  },
  methods: {
    applyFilters() {
      let myQuery = {};
      if (this.combinedInput) {
        myQuery.combine = this.combinedInput;
      }
      this.$router.push({
        name: "teach-poem",
        query: myQuery
      });
    }
  },
  watchQuery: true
};
</script>

<style scoped lang="scss">
.ttp__title {
  margin-bottom: 26px;
  font-size: 1.7rem;
}
.ttp__body {
  font-weight: 400;
}
.ttp__image {
  max-width: 300px;
}
.tabular-list__header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
}
.plans-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.plans-list__search {
  margin-top: 2rem;
}
.plan__link {
  font-weight: 560;
}
.legend-selects {
  display: flex;
  flex-basis: 100%;
  padding: 1rem 1rem 1rem 2rem;
  border-right: $form__border;

  select {
    &:not(:last-child) {
      margin-right: 1rem;
    }
  }
}

.plans-list__filters__legend {
  flex-basis: 50%;

  legend {
    margin: 0;
    line-height: 2;
    font-size: $font-size-base;
    color: $gray-700;
  }
}

.plans-list__input--search {
  flex-basis: 100%;
  padding: 1rem;
  position: relative;

  input {
    border: none;
    background-color: transparent;

    &:hover,
    &:focus,
    &:active {
      border: none;
      background-color: transparent;
    }

    &::placeholder {
      color: $gray-700;
    }
  }

  button {
    width: 2rem;
    height: 2rem;
    display: flex;
    padding: 0;
    justify-content: center;
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;

    &:hover,
    &:focus,
    &:active,
    &:active:focus {
      // Some really sticky rules getting applied from BS that need a bit of
      // force.
      background-color: transparent !important;
      box-shadow: none !important;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
