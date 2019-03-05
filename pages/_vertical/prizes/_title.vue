<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xl="12">
          <h1>{{ prizes.title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          v-html="prizes.body"
          class="prizes__body"
          xl="12"/>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import * as qs from "qs";
import * as _ from "lodash";

export default {
  async asyncData({ app, params, query }) {
    const prizes = await app.$axios
      .$get(`/api/node/${}/${response.data.entity.uuid}`)
      .then(response => {
        return {
          response: response,
          data: {
            title: "Prizes",
            link: {
              to: `/${params.vertical}/prizes`,
              text: `${response.meta.count} Prizes`
            },
            prizes: _.map(response.data, item => {
              return {
                title: item.attributes.title,
                titleLink: item.attributes.path.alias,
                body: item.attributes.body.value
              };
            })
          }
        };
      });

    return { prizes: prizes };
  }
};
</script>
s
<style scoped lang="scss">
.book__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>
