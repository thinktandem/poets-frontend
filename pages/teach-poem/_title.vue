<template>
  <b-container class="teach_this_poem__container">
    <b-row class="py-5">
      <b-col md="8">
        <div
          class="teach_this_poem__body"
          v-if="$store.state.pageData.data.attributes.body"
          v-html="replaceFileUrl($store.state.pageData.data.attributes.body.value)"/>
      </b-col>
      <b-col
        md="4"
        tag="aside">
        <div
          class="teach_this_poem__image-container"
          v-if="$store.state.highlightedData">
          <b-img
            class="teach_this_poem__image"
            :src="$store.state.highlightedData.imageUrl"
            :alt="$store.state.highlightedData.imageMeta.alt"/>
        </div>
        <div
          class="teach_this_poem__side_text_1"
          v-if="$store.state.pageData.data.attributes.field_side_text_1"
          v-html="replaceFileUrl($store.state.pageData.data.attributes.field_side_text_1.value)"/>
        <div
          class="teach_this_poem_side_text_2"
          v-if="$store.state.pageData.data.attributes.field_side_text_2"
          v-html="replaceFileUrl($store.state.pageData.data.attributes.field_side_text_2.value)"/>
        <div
          class="teach_this_poem_more_link-container"
          v-if="$store.state.highlightedData">
          <b-link
            v-if="$store.state.pageData.data.attributes.field_more_link"
            class="more-link"
            :href="$store.state.highlightedData.link">
            {{ $store.state.pageData.data.attributes.field_more_link.title }}
          </b-link>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import _ from "lodash";

export default {
  layout: "default",
  async fetch({ app, store, route, error }) {
    return app.$axios
      .$get(`/router/translate-path?path=${route.path}`)
      .catch(err => {
        error({ statusCode: 404, message: "" });
      })
      .then(routerResponse => {
        return app.$axios
          .$get(routerResponse.jsonapi.individual, {
            params: {
              include: "field_side_image"
            }
          })
          .then(async response => {
            store.commit("updateHero", {
              variant: "default",
              heading: _.get(response, "data.attributes.title"),
              lead: _.get(response, "data.attributes.lead_text")
            });
            const checkForId = _.get(response, "included");
            let highlightedData = null;
            if (checkForId) {
              highlightedData = await app.$axios
                .$get(
                  `/api/file/file/${
                    response.included[0].relationships.field_image.data.id
                  }`
                )
                .then(async res => {
                  return {
                    imageUrl: _.get(res, "data.links.portrait.href"),
                    imageMeta: _.get(
                      response,
                      "included[0].relationships.field_image.data.meta"
                    )
                  };
                })
                .catch(error => {
                  console.log(error);
                });
              if (!_.isEmpty(response.data.attributes.field_more_link)) {
                const link = await app.$axios
                  .$get(
                    `/router/translate-path?path=/${
                      _.split(
                        response.data.attributes.field_more_link.uri,
                        ":"
                      )[1]
                    }`
                  )
                  .then(res => {
                    return app.$axios
                      .$get(res.jsonapi.individual)
                      .then(res => {
                        return res.data.attributes.path.alias;
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  })
                  .catch(error => {
                    console.log(error);
                  });
                highlightedData.link = link ? link : null;
              }
            }
            // Set the main page data
            store.commit("updatePageData", response);
            const sidebarData = _.get(response, "included", []);
            store.commit("updateSidebarData", sidebarData);
            store.commit("updateHighlightedData", highlightedData);
            store.commit("updateRelatedContent", []);
            store.commit("updateFeaturedContent", []);
            store.commit("updateExtendedContent", []);
          });
      })
      .catch(error => console.error(error));
  }
};
</script>
<style scoped lang="scss">
.teach_this_poem__container {
  font-size: 1.2rem;
}
.teach_this_poem__body {
  font-weight: 400;
}
.plan__title {
  margin-bottom: 26px;
}
.plan__body {
  font-weight: 400;
}
/** sidebar **/
.teach_this_poem__image {
  max-width: 300px;
}
</style>
