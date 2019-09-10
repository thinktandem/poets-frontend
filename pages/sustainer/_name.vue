<template>
  <div class="container">
    <h1 class="sustainer__title m-2">{{ title }}</h1>
    <div
      class="sustainer__body" 
      v-html="body"/>
  </div>
</template>
<script>
import inlineImages from "~/plugins/inlineImagesUrl";

export default {
  layout: "sustainer",
  data() {
    return {
      title: null,
      body: null
    };
  },
  mounted() {
    Promise.all([this.getSustainer()]);
  },
  methods: {
    getSustainer() {
      const susQuery = {
        filter: {
          status: 1
        },
        route: this.$route.path
      };
      this.$api
        .getSustainerUuidViaRoute(susQuery)
        .then(res => {
          return res.data.entity.uuid;
        })
        .then(sus => {
          this.$api
            .getSustainer({
              id: sus
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
.sustainer__body {
  font-weight: 400;
  font-size: 1.2em;
}
</style>
