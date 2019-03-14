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
        alt: _.get(related, "meta.alt", null),
        title: _.get(related, "meta.title", null)
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
    return app.$axios
      .$get(`/router/translate-path?path=${path}`)
      .then(routerResponse => {
        return app.$axios
          .$get(`${routerResponse.jsonapi.individual}?include=${includes}`)
          .then(response => {
            let page = response;
            if (_.get(page, "data.attributes.body.processed")) {
              page.data.attributes.body.processed = imgUrl.staticUrl(
                page.data.attributes.body.processed
              );
            }

            store.commit("updateHero", {
              variant: "default",
              heading: _.get(page, "data.attributes.title"),
              lead: _.get(page, "data.attributes.lead_text")
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
            // Right now we don't have a field for related content, but pages
            // May occasionally stick stuff there and we don't want it to bleed.
            // Make sure you call the additional changes AFTER this function.
            store.commit("updateRelatedContent", {});
          });
      })
      .catch(error => {
        console.log(error);
        store.commit("updateHero", {
          variant: "quote",
          lead:
            "Poetry offers us the capacity to carry in us and express the contradictory impulses that make us human.",
          subtext: "—Kwame Dawes, Academy of American Poets Chancellor (2018- )"
        });

        // Set the main page data
        store.commit("updatePageData", {});
        store.commit("updateSidebarData", []);
        store.commit("updateHighlightedData", []);
        store.commit("updateExtendedContent", []);
        store.commit("updateFeaturedContent", []);
        store.commit("updateRelatedContent", {});
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
      // If the current page is in the second level, check for children
      const subMenu =
        _.find(midMenu.children, link => link.to === "/" + currentSubPage) ||
        _.find(midMenu.children, link => link.to === "/" + path[1]);
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
