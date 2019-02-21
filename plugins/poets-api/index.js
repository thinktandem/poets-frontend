/**
 * @file
 * Provide some helpers for interacting with the Poets API
 */

import sections from "./lib/sections";

export default ({ app }, inject) => {
  /**
   * Inject a helper function to build out basic pages. this can be called within the 'fetch' function of any nuxt page
   * to automatically hydrate the store items needed to render a basic page.
   */
  inject("buildBasicPage", (app, store, path) => {
    // The router request
    const routerRequest = {
      requestId: "router",
      action: "view",
      uri: `/router/translate-path?path=${path}`
    };
    // This is the list of items to include with the page request
    const includes = [
      "sidebar_sections.image",
      "field_content_sections.image",
      "highlighted_content.field_image",
      "field_content_sections.resource_file",
      "sidebar_sections.resource_file",
      "field_content_sections.side_image.field_image",
      "featured.featured_media.field_image"
    ].join(",");
    // The page request
    const pageRequest = {
      requestId: "Page",
      action: "view",
      headers: {
        Accept: "application/json",
        "X-CONSUMER-ID": process.env.CONSUMER_ID
      },
      uri: `{{router.body@$.jsonapi.individual}}?include=${includes}`,
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
        let page = JSON.parse(response.data["Page#uri{0}"].body);

        store.commit("updateHero", {
          variant: "default",
          heading: page.data.attributes.title,
          lead: page.data.attributes.hasOwnProperty("lead_text")
            ? page.data.attributes.lead_text
            : null
        });
        // Set the main page data
        store.commit("updatePageData", page);
        const sidebarData = sections.buildSidebar(page);
        store.commit("updateSidebarData", sidebarData);
        // Handle the content in the 'highlighted' area.
        const highlightedData = sections.buildHighlightedData(page);
        store.commit("updateHighlightedData", highlightedData);
        const extendedContent = sections.buildExtendedContentSection(page);
        store.commit("updateExtendedContent", extendedContent);
        const featuredContent = sections.buildFeaturedContentSection(page);
        store.commit("updateFeaturedContent", featuredContent);
      });
  });
};
