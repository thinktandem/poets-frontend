import * as _ from "lodash";
export default ({ app }, inject) => {
  inject("buildBasicPage", (app, store, params) => {
    const routerRequest = {
      requestId: "router",
      action: "view",
      uri: `/router/translate-path?path=${params.vertical}/${params.slug}`
    };
    const pageRequest = {
      requestId: "Page",
      action: "view",
      headers: {
        Accept: "application/json"
      },
      uri: `{{router.body@$.jsonapi.individual}}?include=field_content_sections.image,highlighted_content.field_image`,
      waitFor: ["router"]
    };
    return app.$axios
      .post("/subrequests?_format=json", [routerRequest, pageRequest], {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      })
      .then(response => {
        const page = JSON.parse(response.data["Page#uri{0}"].body);
        // Set the current hero
        store.commit("updateHero", {
          variant: "default",
          heading: page.data.attributes.title,
          lead: page.data.attributes.hasOwnProperty("lead_text")
            ? page.data.attributes.lead_text
            : null
        });
        // Set the main page data
        store.commit("updatePageData", page);
        // Set the sidebar
        const components = {
          "paragraph--resource": "ResourceCard",
          "paragraph--video": "VideoBlock"
        };
        const sidebarData = _(page.included)
          .filter(item => item.type.includes("paragraph"))
          .map(item => {
            return {
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
          })
          .value();
        // The signup block should always be the second item if there are
        // more than one.
        const signupBlock = {
          component: "SignupBlock",
          props: {}
        };
        // // Javascript is evil, boo side effects!
        if (sidebarData.length >= 1) {
          sidebarData.splice(1, 0, signupBlock);
          store.commit("updateSidebarData", sidebarData);
        } else {
          store.commit("updateSidebarData", [signupBlock]);
        }
        // Handle the content in the 'highlighted' area.
        const highlightedData = _(page.included)
          .filter(item => item.type.includes("node"))
          .map(item => {
            return {
              data: item,
              title: item.attributes.title,
              img: item.relationships.field_image,
              text:
                item.attributes.body.summary || item.attributes.body.processed,
              titleLink: item.attributes.path.alias
            };
          })
          .value();
        store.commit("updateHighlightedData", highlightedData);
      });
  });
};
