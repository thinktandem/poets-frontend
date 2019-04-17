<template>
  <div>
    <b-container md="8">
      <h3 class="texts-by__title">
        {{ poet.data.attributes.title }}
      </h3>
    </b-container>
    <b-container class="texts-list tabular-list">
      <b-row class="tabular-list__row tabular-list__header">
        <b-col md="4">
          Name
        </b-col>
        <b-col md="4">
          Subject
        </b-col>
        <b-col md="4">
          Year
        </b-col>
      </b-row>
      <b-row
        v-for="text in texts"
        class="tabular-list__row texts-list__texts"
        :key="text.id">
        <b-col md="4">
          <a
            v-if="text.attributes.path"
            :href="text.attributes.path.alias"
            v-html="replaceFileUrl(text.attributes.title)"/>
        </b-col>
        <b-col md="4">
          {{ poet.data.attributes.title }}
        </b-col>
        <b-col md="4">
          {{ text.attributes.field_date_published }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import qs from "qs";

export default {
  components: {},
  data() {
    return {
      combinedInput: null,
      results: null,
      Next: null,
      Prev: null,
      preparedCombine: null,
      author: null
    };
  },
  async asyncData({ app, params, query, route }) {
    const poet = await app.$axios
      .$get(`/router/translate-path?path=/poet/${params.author}`)
      .then(async res => {
        return app.$axios.$get(`/api/node/person/${res.entity.uuid}`);
      })
      .catch(error => {
        console.error(error);
        this.$sentry.captureException(error);
      });
    const textsByParams = qs.stringify({
      filter: {
        status: 1,
        "field_poets_as_subject.id": poet.data.id
      }
    });
    const texts = await app.$axios.$get(`/api/node/texts?${textsByParams}`);

    return {
      poet,
      texts: texts.data
    };
  }
};
</script>

<style scoped lang="scss">
.texts-by__title {
  margin-top: 26px;
  font-size: 2.4rem;
}
.tabular-list__header {
  font-weight: 600;
}
.texts-list__texts {
  font-weight: 400;
  a {
    color: $body-color;

    &:hover,
    &:focus,
    &:active {
      text-decoration: underline;
    }
  }
}

.texts-list {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
</style>
