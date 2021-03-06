<template>
  <main class="p-4">
    <div class="logo">
      <b-img
        src="/hero/Large-Grey-RGB-poets.png"
        alt=""/></div>
    <p class="lead">Published on Academy of American Poets <span v-if="host">({{ host }})</span></p>
    <hr>
    <article>
      <h1
        class="font-serif font-italic"
        v-if="poem.attributes.title">{{ poem.attributes.title }}</h1>
      <div
        class="font-serif"
        v-if="poem.attributes.body"
        v-html="replaceFileUrl(poem.attributes.body.processed)"/>
      <section class="py-3">
        <p class="h4">Credit</p>
        <hr>
        <div
          v-if="poem.attributes.field_credit"
          v-html="replaceFileUrl(poem.attributes.field_credit.processed)"/>
      </section>
      <section
        class="py-3"
        v-if="poem.attributes.field_about_this_poem">
        <h2
          v-if="poem.attributes.field_about_this_poem"
          class="h4">About this Poem</h2>
        <hr>
        <div v-html="replaceFileUrl(poem.attributes.field_about_this_poem.processed)"/>
      </section>
      <section
        class="py-3"
        v-if="poet">
        <h2 class="h4">Author</h2>
        <hr>
        <p
          class="h3"
          v-if="poet.attributes.title">{{ poet.attributes.title }}</p>
        <div class="d-flex flex-row py-3">
          <div class="w-25">
            <b-img
              fluid
              v-if="image"
              :src="image.src"
              :alt="image.alt"/>
          </div>
          <div
            class="py-3 pl-4 w-75"
            v-if="poet.attributes.body"
            v-html="replaceFileUrl(poet.attributes.body.summary || poet.attributes.body.processed)"/>

        </div>
      </section>
      <p v-if="poem.attributes.field_date_published">Date Published: {{ poem.attributes.field_date_published }}</p>
      <p v-if="poem.attributes.path.alias">Source URL: {{ host }}{{ poem.attributes.path.alias }}</p>
    </article>
  </main>
</template>
<script>
import _ from "lodash";
import MetaTags from "~/plugins/metatags";
export default {
  layout: "minimal",
  head() {
    return MetaTags.renderTags(this.$route, [
      {
        attributes: {
          name: "robots",
          content: "noindex"
        }
      },
      {
        attributes: {
          name: "title",
          content: "Print version of " + this.poem.attributes.title
        }
      }
    ]);
  },
  async asyncData({ app, params, req, res, error }) {
    return app.$axios
      .$get(`/api/node/poems/${params.uuid}?include=field_author.field_image`)
      .catch(err => {
        error({ statusCode: 404, message: "" });
      })
      .then(response => {
        const poet = _.find(
          response.included,
          include =>
            include.id ===
            _.get(
              _.first(_.get(response, "data.relationships.field_author.data")),
              "id"
            )
        );
        const image = _.find(
          response.included,
          include =>
            include.id ===
            _.get(_.first(_.get(poet, "relationships.field_image.data")), "id")
        );

        return {
          poem: _.get(response, "data"),
          poet,
          image: {
            src: _.get(image, "links.poem_a_day_portrait.href"),
            alt: _.get(
              _.first(_.get(poet, "data.relationships.field_image.data")),
              "id"
            )
          },
          host: process.server
            ? `https://${req.headers.host}`
            : `https://${window.location.hostname}`
        };
      });
  }
};
</script>
<style lang="scss" scoped>
.logo g path:first-child {
  fill: $print-logo-grey;
}
main {
  font-weight: 400;
}
</style>
