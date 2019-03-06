<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="12">
          <h1>{{ programs.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="programs.attributes.body.value"
          class="program__body"
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
          path: `${params.vertical}/programs/${params.title}`
        }
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/prize_or_program/${res.data.entity.uuid}`)
          .then(res => {
            return {
              programs: res.data.data
            };
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  },
  async fetch({ store }) {
    store.commit("updateHero", {
      heading: "Programs"
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
