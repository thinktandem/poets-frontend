<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col md="8">
          <h1>{{ book.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="replaceFileUrl(book.attributes.body.value)"
          class="book__body"
          md="8"/>
        <b-col md="4">
          <b-img
            v-if="field_image"
            class="book__image"
            :src="field_image.src"
            :alt="field_image.alt"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import MetaTags from "~/plugins/metatags";

export default {
  head() {
    return MetaTags.renderTags(this.book.attributes.metatag_normalized);
  },
  async asyncData({ app, params }) {
    return app.$axios
      .get(`/router/translate-path?path=/book/${params.title}`)
      .catch(err => {
        app.handleError(err);
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/books/${res.data.entity.uuid}?include=field_image`)
          .then(res => {
            return {
              book: _.get(res, "data.data"),
              field_image:
                app.$buildImg(
                  _.get(res, "data"),
                  _.get(res, "data.included.field_image"),
                  "field_image",
                  "book"
                ) || null
            };
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>

<style scoped lang="scss">
.book__body {
  font-weight: 400;
  font-size: 1.2em;
  /deep/ iframe {
    max-height: 788px;
  }
}
.book__image {
  max-width: 300px;
}
</style>
