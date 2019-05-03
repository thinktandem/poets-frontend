<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="8">
          <div
            class="text__body"
            md="8">
            <div
              class="text__body-preface"
              v-html="replaceFileUrl($store.state.pageData.data.attributes.body.processed)"/>
          </div>
        </b-col>
        <b-col md="4">
          <div class="text__contributors-label">
            Author:
          </div>
          <div
            v-if="contributors"
            class="text__sidebar-item text__written-by"
            v-for="(contributor, i) in contributors"
            :key="i">
            <b-link :to="contributor.attributes.path.alias">
              {{ contributor.attributes.title }}
            </b-link>
          </div>
          <div class="text__posted-label">
            Posted:
          </div>
          <div class="text__sidebar-item text__date-published">
            {{ datePublished }}
          </div>
          <div class="text__type-label">
            Type:
          </div>
          <div class="text__sidebar-item text__type">
            {{ type }}
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import MetaTags from "~/plugins/metatags";
import niceDate from "~/plugins/niceDate";

export default {
  data() {
    return {
      contributors: [],
      datePublished: "",
      type: ""
    };
  },
  head() {
    return MetaTags.renderTags(
      this.$store.state.pageData.data.attributes.metatag_normalized
    );
  },
  mounted() {
    this.contributors = _.filter(
      this.$store.state.pageData.included,
      include => include.type === "node--person"
    );
    this.datePublished = niceDate.niceDate(
      _.get(this.$store.state.pageData, "data.attributes.field_date_published")
    );

    const type = _.find(
      _.get(this.$store.state.pageData, "included"),
      include => include.type === "taxonomy_term--text_type"
    );
    this.type = _.get(type, "attributes.name");
  },
  async fetch({ app, store, route }) {
    return app.$axios
      .get(`/router/translate-path`, {
        params: {
          path: route.path
        }
      })
      .catch(err => {
        app.handleError(err);
      })
      .then(res =>
        app.$axios
          .$get(
            `/api/node/texts/${res.data.entity.uuid}` +
              `?include=field_contributors,field_texttype`
          )
          .catch(err => {
            app.handleError(err);
          })
          .then(res => {
            store.commit("updateHero", {
              heading: _.get(res, "data.attributes.title")
            });
            store.commit("updatePageData", res);
          })
      );
  }
};
</script>

<style scoped lang="scss">
.text__body {
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
.text__sidebar-item {
  margin-bottom: 2rem;
  font-weight: 400;
}
</style>
