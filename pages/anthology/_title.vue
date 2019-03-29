<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xs="12">
          <div
            class="anthology"
            v-html="body"/>
        </b-col>
      </b-row>
    </b-container>
    <b-container
      v-for="(poem, i) in $store.state.relatedContent"
      :key="poem.id">
      <div
        class="anthology__first-poem"
        v-if="i === 0">
        <h3 v-html="poem.attributes.title"/>
        <div
          class="anthology__poem-body"
          v-html="poem.attributes.body.processed"/>
      </div>
      <div
        class="anthology__poems-list"
        v-else>
        <b-row
          class="anthology__list-header"
          v-if="i === 1">
          <b-col md="4">
            Title
          </b-col>
          <b-col md="4">
            Year
          </b-col>
        </b-row>
        <b-row class="anthology__poem-list-item">
          <b-col md="4">
            <b-link
              class="anthology__poem-link"
              v-html="poem.attributes.title"
              :to="poem.attributes.path.alias"/>
          </b-col>
          <b-col
            md="4"
            v-html="niceDate(poem.attributes.field_date_published, 'year')"/>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import _ from "lodash";
import MetaTags from "~/plugins/metatags";
import niceDate from "~/plugins/niceDate";

export default {
  layout: "default",
  components: {},
  data() {
    return {
      body: "",
      included: {}
    };
  },
  head() {
    return MetaTags.renderTags(this.$store.state.metatags);
  },
  mounted() {
    this.body = _.get(
      this.$store.state.pageData,
      "data.attributes.body.processed"
    );
    this.related = this.$store.state.relatedContent;
  },
  async fetch({ app, store, route }) {
    return app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .then(res => {
        return app.$axios
          .$get(res.jsonapi.individual + "?include=field_poems")
          .then(res => {
            store.commit("updateHero", {
              variant: "default",
              heading: _.get(res, "data.attributes.title"),
              lead: _.get(res, "data.attributes.lead_text")
            });
            // Set the main page data
            store.commit("updatePageData", res);
            store.commit("updateSidebarData", []);
            store.commit("updateHighlightedData", []);
            const metatags = res.data.attributes.metatag_normalized;
            store.commit("updateMetatags", metatags);
            const included = res.included;
            store.commit("updateRelatedContent", included);
            console.log(
              "\n\n---included????--\n",
              included,
              "\n\n count\n",
              _.size(included)
            );
            return {
              props: {
                title: _.get(res, "attributes.title"),
                text: _.get(res, "attributes.body.summary"),
                link: _.get(res, "attributes.path.alias")
              }
            };
          })
          .catch(err => console.log(err));
        store.commit("updateFeaturedContent", []);
        store.commit("updateExtendedContent", []);
      })
      .catch(err => console.log(err));
  },
  methods: {
    niceDate(date, format) {
      return niceDate.niceDate(date, format);
    }
  }
};
</script>
<style lang="scss" scoped>
.anthology {
  font-weight: 400;
}
.anthology__poem-body {
  font-weight: 400;
}
.anthology__poems-list {
  margin-bottom: 22px;
}
.anthology__list-header {
  background-color: #f2f8fa;
  text-transform: uppercase;
  font-weight: 560;
  padding: 11px 0 11px 0;
}
.anthology__poem-list-item {
  padding: 8px 0 8px 0;
  border-bottom: 1px solid var(--gray-600);
}
</style>
