<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="7">
          <h1>{{ title }}</h1>
          <div
            class="institution__body"
            v-html="body"/>
          <div
            v-if="link"
            class="institution__link">
            <a :href="link.uri">
              {{ link.title }}
            </a>
          </div>
        </b-col>
        <b-col
          offset-md="1"
          md="4">
          <b-img-lazy
            v-if="sideBarImage"
            fluid
            center
            class="poet__image"
            :src="sideBarImage.src"
            :alt="sideBarImage.alt"/>
          <div
            v-if="state"
            class="institution__sidebar-state">
            State: <b-link :to="stateLink">{{ state }}</b-link>
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
    const institution = await app.$axios
      .get(`/router/translate-path`, {
        params: {
          path: `/institution/${params.title}`
        }
      })
      .catch(err => {
        error({ statusCode: 404, message: "" });
      })
      .then(res => {
        return app.$axios
          .get(
            `/api/node/institution/${
              res.data.entity.uuid
            }?include=field_state,field_image`
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
    const unFilteredBody = _.get(institution, "data.attributes.body.processed");
    const body = imgUrl.staticUrl(unFilteredBody, app);
    const title = _.get(institution, "data.attributes.title");
    const link = _.get(institution, "data.attributes.field_link");
    const state = _.find(_.get(institution, "included"), include => {
      return _.get(include, "type") === "node--state";
    });
    const sideBarImage = app.$buildImg(
      institution,
      null,
      "field_image",
      "poem_a_day_portrait"
    );

    return {
      title,
      body,
      link,
      sideBarImage,
      state: _.get(state, "attributes.title"),
      stateLink: _.get(state, "attributes.path.alias"),
      metatags: _.get(institution, "data.attributes.metatag_normalized")
    };
  }
};
</script>

<style scoped lang="scss">
.institution__body {
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
