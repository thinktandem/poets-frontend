<template>
  <div class="container">
    <h1 class="membership__title m-2">{{ title }}</h1>
    <div
      class="membership__body" 
      v-html="body"/>
  </div>
</template>
<script>
import inlineImages from "~/plugins/inlineImagesUrl";

export default {
  layout: "membership",
  data() {
    return {
      title: null,
      body: null
    };
  },
  mounted() {
    Promise.all([this.getMembership()]);
  },
  methods: {
    getMembership() {
      const memQuery = {
        filter: {
          status: 1
        },
        route: this.$route.path
      };
      this.$api
        .getMembershipUuidViaRoute(memQuery)
        .then(res => {
          return res.data.entity.uuid;
        })
        .then(mem => {
          this.$api
            .getMembership({
              id: mem
            })
            .then(data => {
              this.title = data.data.data.attributes.title;
              this.body = inlineImages.staticUrl(
                data.data.data.attributes.body.value
              );
            });
        });
    }
  }
};
</script>
<style scoped>
.membership__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>
