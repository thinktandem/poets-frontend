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
          v-html="text.attributes.body.value"
          class="text__body"
          xl="12"/>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  async asyncData({ app, params }) {
    return app.$axios
      .get(`/router/translate-path`, {
        params: {
          path: `${params.vertical}/text/${params.title}`
        }
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/texts/${res.data.entity.uuid}`)
          .then(res => {
            console.log("\n\nres.data.data??????\n\n", res.data.data);
            return {
              text: res.data.data
            };
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style scoped lang="scss">
.text__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>
