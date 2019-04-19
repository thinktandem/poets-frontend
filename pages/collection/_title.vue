<template>
  <div>
    <b-container class="py-5">
      <b-row>
        <b-col xs="12">
          <div
            class="collection"
            v-html="body"/>
        </b-col>
      </b-row>
    </b-container>
    <app-card-columns
      :cards="related"/>
  </div>
</template>

<script>
import _ from "lodash";
import AppCardColumns from "~/components/AppCardColumns";
import MetaTags from "~/plugins/metatags";

export default {
  layout: "default",
  components: {
    AppCardColumns
  },
  data() {
    return {
      body: "",
      related: []
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
      .catch(err => {
        app.handleError(err);
      })
      .then(routerResponse => {
        return app.$axios
          .$get(
            routerResponse.jsonapi.individual + "?include=field_linked_content"
          )
          .then(response => {
            store.commit("updateHero", {
              variant: "default",
              heading: _.get(response, "data.attributes.title"),
              lead: _.get(response, "data.attributes.lead_text")
            });
            // Set the main page data
            store.commit("updatePageData", response);
            store.commit("updateSidebarData", []);
            store.commit("updateHighlightedData", []);
            const metatags = response.data.attributes.metatag_normalized;
            store.commit("updateMetatags", metatags);
            const relatedContent = _.map(
              _.get(response, "data.relationships.field_linked_content.data"),
              item => {
                const entity = _.find(
                  _.get(response, "included"),
                  include => include.id === _.get(item, "id")
                );

                const cardTypes = {
                  "node--lesson_plans": "LessonPlanCard",
                  "node--books": "BookCard",
                  "node--texts": "EssayCard",
                  "node--person": "PoetCard",
                  "node--poem": "PoemCard",
                  "node--events": "AppCard"
                };
                return {
                  response,
                  type: cardTypes[entity.type],
                  props: {
                    title: _.get(entity, "attributes.title"),
                    text: _.get(entity, "attributes.body.summary"),
                    link: _.get(entity, "attributes.path.alias")
                  }
                };
              }
            );
            store.commit("updateRelatedContent", relatedContent);
            store.commit("updateFeaturedContent", []);
            store.commit("updateExtendedContent", []);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>
<style lang="scss" scoped>
.collection {
  font-weight: 400;
}
</style>
