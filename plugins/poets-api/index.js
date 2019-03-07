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
  inject("buildBasicPage", async (app, store, path) => {
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
    const routerResponse = await app.$axios.$get(
      `/router/translate-path?path=${path}`
    );
    return app.$axios
      .$get(`${routerResponse.jsonapi.individual}?include=${includes}`)
      .then(response => {
        let page = response;
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
  inject("buildMenu", ({ menu, route, store }) => {
    const transformTree = menu => {
      return _.zipWith(
        _.keys(menu),
        _.map(menu, link => link.to),
        (text, to) => ({
          text,
          to
        })
      );
    };
    const path = route.path.split("/");
    const top = transformTree(menu);

    store.commit(
      "updateTopMenu",
      _.reject(top, link => link.text == "Poets.org")
    );
    // Vertical should be the first route segment after the root /.
    const currentVertical = path.length >= 2 ? path[1] : "";
    const midMenu =
      _.find(menu, link => link.to === "/" + currentVertical) ||
      _.find(menu, (link, key) => key === "Poets.org");
    store.commit("updateMidMenu", transformTree(midMenu.children));
    const currentSubPage = path.length >= 3 ? path[1] + "/" + path[2] : path[1];

    const buildSubMenu = (midMenu, currentSubPage) => {
      const subMenu = _.find(
        midMenu.children,
        link => link.to === "/" + currentSubPage
      );
      return _.get(subMenu, "children") ? transformTree(subMenu.children) : [];
    };

    store.commit("updateSubMenu", buildSubMenu(midMenu, currentSubPage));
  });
  /**
   * Abstract away the ugliness of pulling a related entity
   */
  inject(
    "getRelated",
    (topLevelResponse = {}, entity = null, relationship = "") => {
      return _.find(
        _.get(topLevelResponse, "included"),
        include =>
          _.get(include, "id") ===
          _.get(
            _.first(_.get(entity, `relationships.${relationship}.data`)),
            "id"
          )
      );
    }
  );
};
