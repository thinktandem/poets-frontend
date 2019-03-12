<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="12">
          <h1>{{ job.attributes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="job.attributes.body.value"
          class="job__body"
          xl="8"/>
      </b-row>
      <b-row>
        <b-col xl="8">
          <b-link
            :href="job.attributes.link_to_job.uri"
            target="__job">
            {{ job.attributes.link_to_job.title }}
          </b-link>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  async asyncData({ app, store, params }) {
    return app.$axios
      .get(`/router/translate-path`, {
        params: {
          path: `/job/${params.title}`
        }
      })
      .then(res => {
        return app.$axios
          .get(`/api/node/job/${res.data.entity.uuid}`)
          .then(res => {
            return {
              job: res.data.data
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
.job__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>
