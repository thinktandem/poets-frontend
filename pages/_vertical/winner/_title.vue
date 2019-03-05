<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="12">
          <h1>{{ winner.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="winner.attributes.body.value"
          class="prizes__body"
          xl="12"/>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  asyncData: async function({ app, params }) {
    return app.$axios
      .get(`/router/translate-path`, {
        params: {
          path: `${params.vertical}/winner/${params.title}`
        }
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/sub_prize_or_program/${res.data.entity.uuid}`)
          .then(res => {
            return {
              winner: res.data.data
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
.book__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>
