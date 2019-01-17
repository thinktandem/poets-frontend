<template>
  <b-container class="py-5">
    <b-row class="basic_page__body">
      <b-col md="8">
        <div v-html="$store.state.pageData.attributes.body.processed"/>
      </b-col>
      <b-col
        md="4"
        class="basic_page__sidebar">
        <component
          v-for="(item, index) in $store.state.sidebarData"
          :key="index"
          :is="item.component"
          v-bind="item.props"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ProgramsAnnouncements from "~/components/ProgramsAnnouncements";
import ResourceCard from "~/components/ResourceCard";
import VideoBlock from "~/components/VideoBlock.vue";
import qs from "qs";
import * as _ from "lodash";
import SignupBlock from "~/components/SignupBlock";
export default {
  components: {
    ProgramsAnnouncements,
    ResourceCard,
    SignupBlock,
    VideoBlock
  },
  async fetch({ app, store, params }) {
    // Build an alias path to query
    const routerQuery = qs.stringify({
      path: `${params.vertical}/${params.slug}`
    });

    const routerRequest = {
      requestId: "router",
      action: "view",
      uri: `/router/translate-path?${routerQuery}`
    };
    const pageQuery = qs.stringify({
      fields: {
        "node--basic_page": ["title", "body", "path", "lead_text"]
      }
    });
    const pageRequest = {
      requestId: "Page",
      action: "view",
      uri: `{{router.body@$.jsonapi.individual}}?${pageQuery}`,
      headers: {
        "Content-Type": "application/vnd.api+json"
      },
      waitFor: ["router"]
    };
    return app.$axios
      .$post("/subrequests", [routerRequest, pageRequest], {
        params: {
          _format: "json"
        },
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        const page = JSON.parse(response["Page#uri{0}"].body);
        // Set the current hero
        store.commit("updateHero", {
          variant: "default",
          heading: page.data.attributes.title,
          lead: page.data.attributes.hasOwnProperty("lead_text")
            ? page.data.attributes.lead_text
            : null
        });
        // Set the main page data
        store.commit("updatePageData", page.data);

        // Set the sidebar
        return app.$axios
          .$get(page.data.relationships.field_content_sections.links.related)
          .then(response => {
            const components = {
              "paragraph--resource": "ResourceCard",
              "paragraph--video": "VideoBlock"
            };
            const data = _.map(response.data, item => {
              return {
                data: item,
                component: components[item.type] || "ResourceCard",
                props: {
                  title: item.attributes.title,
                  body:
                    item.attributes.body !== null
                      ? item.attributes.body.processed
                      : null,
                  img: item.relationships.image,
                  file: item.relationships.resource_file,
                  youtubeId: item.attributes.youtube_id,
                  vimeoId: item.attributes.vimeo_id
                }
              };
            });
            // The signup block should always be the second item if there are
            // more than one.
            const signupBlock = {
              component: "SignupBlock",
              props: {}
            };
            // Javascript is evil, boo side effects!
            if (data.length >= 1) {
              data.splice(1, 0, signupBlock);
              store.commit("updateSidebarData", data);
            } else {
              store.commit("updateSidebarData", [signupBlock]);
            }
          });
      });
  }
};
</script>

<style scoped lang="scss">
.basic_page__body {
  font-size: 1.25rem;
  font-weight: 400;
}

.basic_page__sidebar {
  div:first-child {
    margin-top: 0;
    margin-bottom: $spacer * 2;
  }
  div:last-child {
    margin-top: $spacer * 2;
    margin-bottom: 0;
  }
  div:not(:first-child):not(:last-child) {
    margin-top: $spacer * 2;
    margin-bottom: $spacer * 2;
  }
}
</style>
