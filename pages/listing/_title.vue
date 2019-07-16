<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="7">
          <h1>{{ title }}</h1>
          <div
            class="listing__body"
            v-html="body"/>
          <div
            v-if="link"
            class="listing__link">
            <a :href="link.uri">
              {{ link.title }}
            </a>
          </div>
        </b-col>
        <b-col
          offset-md="1"
          md="4">
          <div class="listing__sidebar-state">
            State: <b-link :to="stateLink">{{ state }}</b-link>
          </div>
          <div class="listing__sidebar-type">
            Type: {{ type }}
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import imgUrl from "~/plugins/inlineImagesUrl.js";
import MetaTags from "~/plugins/metatags";

export default {
  head() {
    return MetaTags.renderTags(this.$route, this.metatags);
  },
  async asyncData({ app, params, error }) {
    const listing = await app.$axios
      .get(`/router/translate-path`, {
        params: {
          path: `/listing/${params.title}`
        }
      })
      .catch(err => {
        error({ statusCode: 404, message: "" });
      })
      .then(res => {
        return app.$axios
          .get(
            `/api/node/listing/${res.data.entity.uuid}` +
              `?include=field_state,field_listingtype`
          )
          .then(res => {
            return res.data;
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
    const unFilteredBody = _.get(listing, "data.attributes.body.processed");
    const body = imgUrl.staticUrl(unFilteredBody, app);
    const title = _.get(listing, "data.attributes.title");
    const link = _.get(listing, "data.attributes.field_link");
    const state = _.find(_.get(listing, "included"), include => {
      return _.get(include, "type") === "node--state";
    });
    const type = _.find(_.get(listing, "included"), include => {
      return _.get(include, "type") === "taxonomy_term--listing_type";
    });

    return {
      title,
      body,
      link,
      state: _.get(state, "attributes.title"),
      stateLink: _.get(state, "attributes.path.alias", "pants"),
      type: _.get(type, "attributes.name"),
      metatags: _.get(listing, "data.attributes.metatag_normalized")
    };
  }
};
</script>

<style scoped lang="scss">
.listing__body {
  font-weight: 400;
  font-size: 1.2em;
  .text__body-preface /deep/ img,
  .text__body-end /deep/ img,
  /deep/ img {
    max-width: 100%;
    float: left;
    padding-right: 22px;
  }
}
</style>
