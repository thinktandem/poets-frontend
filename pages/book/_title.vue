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
          <div
            v-if="author"
            class="book__author">
            Author:
            <b-link :to="author.attributes.path.alias">
              {{ author.attributes.title }}
            </b-link>
          </div>
          <div
            v-if="publisherLink"
            class="book__publisher-link">
            Publisher:
            <b-link
              :to="publisherLink.uri">
              {{ publisherLink.title }}
            </b-link>
          </div>
          <div
            v-if="isbn"
            class="book__isbn">
            ISBN: {{ isbn }}
          </div>
          <div
            v-if="worldCatLink"
            class="book__worldcat-link">
            <a :href="worldCatLink.uri">
              Worldcat
            </a>
          </div>
          <div
            v-if="indieBoundLink"
            class="book__indiebound-link">
            <a :href="indieBoundLink.uri">
              IndieBound
            </a>
          </div>
          <div
            v-if="amazonLink"
            class="book__amazon-link">
            <a :href="amazonLink.uri">
              Amazon
            </a>
          </div>
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
          .get(
            `/api/node/books/${
              res.data.entity.uuid
            }?include=field_image,field_author`
          )
          .then(res => {
            return {
              book: _.get(res, "data.data"),
              field_image:
                app.$buildImg(
                  _.get(res, "data"),
                  _.get(res, "data.included.field_image"),
                  "field_image",
                  "book"
                ) || null,
              author: _.find(_.get(res, "data.included"), author => {
                return author.type === "node--person";
              }),
              publisherLink: _.get(res, "data.data.attributes.field_publisher"),
              isbn: _.get(res, "data.data.attributes.field_isbn"),
              worldCatLink: _.get(
                res,
                "data.data.attributes.field_link_worldcat"
              ),
              indieBoundLink: _.get(
                res,
                "data.data.attributes.field_link_indiebound"
              ),
              amazonLink: _.get(res, "data.data.attributes.field_link_amazon")
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
}
.book__image {
  max-width: 300px;
}
</style>
