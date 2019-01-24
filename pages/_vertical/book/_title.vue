<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="12">
          <h1>{{ book.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="book.attributes.body.value"
          class="book__body"
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
          path: `${params.vertical}/book/${params.title}`
        }
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/books/${res.data.entity.uuid}`)
          .then(res => {
            return {
              book: res.data.data
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
