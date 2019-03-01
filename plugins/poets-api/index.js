/**
 * @file
 * Provide some helpers for interacting with the Poets API
 */

import sections from "./lib/sections";
import imgUrl from "~/plugins/inlineImagesUrl";
import _ from "lodash";

export default ({ app }, inject) => {
  /**
   *  @param {Object} topLevelResponse
   *    This is the full json api response from drupal.
   *
   *  @param {Object} entity
   *    This is usually a node, but the main thing is it has to have
   *    an img relationship.
   *
   *  @param {String} relationship
   *    This is the name of the image field you are trying to access.
   *
   *  @param {String} imageStyle
   *    The machine name of the image style on Drupal.
   *
   * @return {Object}
   *   The scr URL of the image style and alt text.
   */
  inject(
    "buildImg",
    (
      topLevelResponse = {},
      entity = null,
      relationship = "field_image",
      imageStyle = "thumbnail"
    ) => {
      const prioritizedEntity = entity || topLevelResponse.data;
      const related = _.first(
        _.get(prioritizedEntity, `relationships.${relationship}.data`)
      );

      const file = _.find(
        _.get(topLevelResponse, "included"),
        include => _.get(include, "id") === _.get(related, "id")
      );
      return {
        src: _.get(file, `links.${imageStyle}.href`, null),
        alt: _.get(related, "meta.alt", null)
      };
    }
  );
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
        if (page.data.attributes.body !== null) {
          page.data.attributes.body.processed = imgUrl.staticUrl(
            page.data.attributes.body.processed
          );
        }

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
