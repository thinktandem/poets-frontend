<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="8">
          <h1>{{ text.attributes.title }}</h1>
          <div
            class="text__body"
            xl="8"
          >
            <div
              class="text__body-preface"
              v-html="replaceFileUrl(body)"/>
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
import imgUrl from "~/plugins/inlineImagesUrl.js";
import niceDate from "~/plugins/niceDate";

export default {
  async asyncData({ app, params }) {
    const text = await app.$axios
      .get(`/router/translate-path`, {
        params: {
          path: `/text/${params.title}`
        }
      })
      .catch(err => {
        app.handleError(err);
      })
      .then(res => {
        return app.$axios
          .get(
            `/api/node/texts/${res.data.entity.uuid}` +
              `?include=field_contributors,field_texttype`
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
    const body = await imgUrl.staticUrl(text.data.attributes.body.value, app);
    const contributors = [];
    _.each(_.get(text, "included"), (include, i) => {
      if (include.type === "node--person") {
        contributors[i] = include;
      }
    });
    const datePublished = niceDate.niceDate(
      _.get(text, "data.attributes.field_date_published")
    );
    const type = _.find(_.get(text, "included"), include => {
      if (include.type === "taxonomy_term--text_type") {
        return include;
      }
    });

    return {
      text: text.data,
      body,
      contributors,
      datePublished,
      type: _.get(type, "attributes.name")
    };
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
