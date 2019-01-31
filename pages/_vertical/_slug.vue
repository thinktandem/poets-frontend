<template>
  <div>
    <basic-page
      :body="$store.state.pageData.attributes.body.processed"
      :highlighted="$store.state.highlightedData"
      :more="$store.state.relatedContent"
      :sidebar-data="$store.state.sidebarData"/>
    <card-deck
      :cards="$store.state.bottomContent.items"
      :cardtype="$store.state.bottomContent.cardType"
      :title="$store.state.bottomContent.title"
      :link="$store.state.bottomContent.link"/>
  </div>
</template>

<script>
import BasicPage from "~/components/BasicPage";
import CardDeck from "~/components/CardDeck";
import qs from "qs";
import * as _ from "lodash";
export default {
  components: {
    BasicPage,
    CardDeck
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
        "node--basic_page": [
          "title",
          "body",
          "path",
          "lead_text",
          "related_content"
        ]
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
                  img: item.relationships.image || null,
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
          })
          .then(() => {
            // Handle the content in the 'highlighted' area.
            return app.$axios
              .$get(page.data.relationships.highlighted_content.links.related)
              .then(response => {
                const data = _.map(response.data, item => {
                  return {
                    data: item,
                    title: item.attributes.title,
                    img: item.relationships.field_image,
                    text:
                      item.attributes.body.summary ||
                      item.attributes.body.processed,
                    titleLink: item.attributes.path.alias
                  };
                });
                store.commit("updateHighlightedData", data);
              });
          })
          .then(() => {
            if (page.data.attributes.related_content !== null) {
              const contentType = page.data.attributes.related_content;
              const type = contentType == "essay" ? "texts" : contentType;
              const params = qs.stringify({
                _format: "json",
                filter: {
                  status: 1
                },
                page: {
                  limit: 4
                }
              });
              return app.$axios
                .$get(`/api/node/${type}?${params}`)
                .then(response => {
                  store.commit("updateRelatedContent", {
                    title: "title",
                    items: response.data
                  });
                });
            } else {
              return null;
            }
          })
          .then(() => {
            if (page.data.attributes.bottom_content !== null) {
              const contentType = _.first(page.data.attributes.bottom_content);
              const type = contentType == "essay" ? "texts" : contentType;
              const params = qs.stringify({
                _format: "json",
                filter: {
                  status: 1
                },
                page: {
                  limit: 3
                }
              });
              return app.$axios
                .$get(`/api/node/${type}?${params}`)
                .then(response => {
                  let payload = {};
                  switch (contentType) {
                    case "essay":
                      payload = {
                        title: "Essays on Teaching Poetry",
                        cardType: "EssayCard",
                        link: {
                          to: `${params.vertical}/texts/essays`,
                          text: `${response.meta.count} essays`
                        },
                        items: _.map(response.data, item => {
                          return {
                            title: item.attributes.title,
                            link: item.attributes.path.alias,
                            text: item.attributes.body.processed,
                            poet: {
                              name: "placeholder"
                            },
                            year: item.attributes.field_date_published
                          };
                        })
                      };
                  }
                  store.commit("updateBottomContent", payload);
                });
            } else {
              return null;
            }
          });
      });
  }
};
</script>

<style scoped lang="scss">
</style>
