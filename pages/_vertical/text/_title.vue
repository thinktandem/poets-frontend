<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="12">
          <h1>{{ text.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          class="text__body"
          xl="12"
        >
          <div v-if="Object.keys(bodyData).length">
            <div v-html="bodyPreface"/>
            <div>
              <b-img :src="bodyData.myImg"/>
            </div>
            <div v-html="bodyEnd"/>
          </div>
          <div
            v-else
            v-html="staticUrl"/>
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
          path: `${params.vertical}/text/${params.title}`
        }
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/texts/${res.data.entity.uuid}`)
          .then(res => {
            return res.data.data;
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
    const bodyData = await imgUrl.imgUrl(text.attributes.body.value, app);

    return {
      text,
      bodyData,
      bodyPreface: imgUrl.staticUrl(bodyData.myJson[0]),
      bodyEnd: imgUrl.staticUrl(bodyData.endJson),
      staticUrl: imgUrl.staticUrl(text.attributes.body.value) || ""
    };
  }
};
</script>

<style scoped lang="scss">
.text__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>
