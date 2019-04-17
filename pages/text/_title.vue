<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="8">
          <h1>{{ text.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          class="text__body"
          xl="8"
        >
          <div
            class="text__body-preface"
            v-html="replaceFileUrl(body)"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import imgUrl from "~/plugins/inlineImagesUrl.js";

export default {
  async asyncData({ app, params }) {
    const text = await app.$axios
      .get(`/router/translate-path`, {
        params: {
          path: `/text/${params.title}`
        }
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/texts/${res.data.entity.uuid}`)
          .then(res => {
            return res.data.data;
          })
          .catch(error => {
            console.log(error);
            this.$sentry.captureException(error);
          });
      })
      .catch(error => {
        console.error(error);
        this.$sentry.captureException(error);
      });
    const body = await imgUrl.staticUrl(text.attributes.body.value, app);

    return {
      text,
      body
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
</style>
