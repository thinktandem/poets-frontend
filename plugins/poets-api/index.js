/**
 * @file
 * Provide some helpers for interacting with the Poets API
 */

import sections from "~/plugins/poets-api/lib/sections";
import media from "~/plugins/poets-api/lib/media";
import util from "~/plugins/poets-api/lib/util";
import imgUrl from "~/plugins/inlineImagesUrl";
import _ from "lodash";
import qs from "qs";

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
  inject("buildImg", media.buildImg);

  /**
   * Inject a helper function to build out basic pages. this can be called within the 'fetch' function of any nuxt page
   * to automatically hydrate the store items needed to render a basic page.
   */
  inject("buildBasicPage", async (app, store, path) => {
    // This is the list of items to include with the page request

    const includes = [
      "hero_background.field_image",
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
            const metatags = page.data.attributes.metatag_normalized;
            store.commit("updateMetatags", metatags);
            store.commit("updateHero", {
              background: media.buildHeroBg(page),
              variant: _.get(page, "data.attributes.hero_type", "default"),
              subtext: _.get(page, "data.attributes.hero_subtext"),
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
        app.$sentry.captureException(error);
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
  });
  // Given the subMenu.json object, find the sub menu items for the provided
  // route.
  inject("buildSubMenu", ({ subMenu, route, store }) => {
    // Function to recurse through subMenu.json.
    const findChildren = (uri, menu) => {
      let value = {};

      // We've reached a dead end; bail.
      if (_.isEmpty(menu)) return;

      // Go through each menu item; if it's a match with route, we've found our
      // subMenu.
      _.each(menu, function(item) {
        if (item.to === uri && _.isEmpty(item.children)) {
          value = menu;
        }
      });

      // If we haven't found our item, recurse until we do.
      if (_.isEmpty(value)) {
        _.each(menu, function(item) {
          if (!_.isEmpty(findChildren(uri, item.children))) {
            value = findChildren(uri, item.children);
          }
        });
      }

      return value;
    };
    store.commit("updateSubMenu", findChildren(route.path, subMenu));
  });
  /**
   * Abstract away the ugliness of pulling a related entity
   */
  inject("getRelated", util.getRelated);

  inject("latestMagazine", async ({ app }) => {
    const magazineQuery = qs.stringify({
      filter: {
        status: 1
      },
      sort: "-changed",
      page: {
        limit: 1
      },
      include: "field_image,field_content_sections"
    });
    const magazine = await app.$axios.$get(
      `/api/node/magazine?${magazineQuery}`
    );
    const topProduct = _.first(magazine.data);
    return {
      response: magazine,
      entity: topProduct,
      title: _.get(topProduct, "attributes.title", null),
      intro: _.get(topProduct, "attributes.magazine_intro.processed", null),
      subTitle: _.get(topProduct, "attributes.subtitle", null),
      contents: _.get(topProduct, "attributes.contents", null),
      img: app.$buildImg(magazine, topProduct, "field_image", "magazine_cover"),
      link: {
        to: `/academy-american-poets/become-member`,
        text: "Become a member"
      }
    };
  });
};
