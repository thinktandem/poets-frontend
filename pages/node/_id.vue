<template>
  <div/>
</template>
<script>
import _ from "lodash";

export default {
  async asyncData({ app, router, params, redirect }) {
    const whereTo = await app.$axios
      .$get(`/router/translate-path?path=/node/${params.id}`)
      .then(res => {
        const path = app.$axios
          .$get(
            `/api/` +
              `${_.get(res, "entity.type")}/` +
              `${_.get(res, "entity.bundle")}/` +
              `${_.get(res, "entity.uuid")}`
          )
          .then(res => {
            return _.get(res, "data.attributes.path.alias");
          })
          .catch(err => console.log(err));
        return path;
      })
      .catch(err => console.log(err));
    redirect(whereTo);
  }
};
</script>
