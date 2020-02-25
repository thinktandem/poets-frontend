/**
 * @file
 * Provide some helpers for interacting with the Poets API
 */

import sections from "~/plugins/poets-api/lib/sections";
import media from "~/plugins/poets-api/lib/media";
import util from "~/plugins/poets-api/lib/util";
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
  inject("buildImg", media.buildImg);

  /**
   * Inject a helper function to build out basic pages. this can be called within the 'fetch' function of any nuxt page
   * to automatically hydrate the store items needed to render a basic page.
   */
  inject("buildBasicPage", async (app, store, path, strict = false) => {
    // This is the list of items to include with the page request

    const includes = [
      "hero_background.field_image",
      "highlighted_content.field_image",
      "field_content_sections.resource_file",
      "sidebar_sections.resource_file",
      "sidebar_sections.media.field_image",
      "field_content_sections.side_image.field_image",
      "field_content_sections.left_image.field_image",
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

  inject("buildMenu", ({ route, store }) => {
    const path = route.path.split("/");
    return app.$axios
      .$get("/api/menu_items/main")
      .then(res => {
        // Vertical should be the first route segment after the root /.
        const currentVertical =
          path.length >= 2 && path[1] !== "" ? path[1] : "/";
        let links = {};
        let midMenu = {};
        _.each(res, (link, i) => {
          const alias = link.alias === "" ? "Poets.org" : link.alias;
          links[alias] = {
            to: link.relative,
            text: link.title
          };
          if (alias === currentVertical) {
            midMenu = {};
            _.each(link.below, child => {
              midMenu[child.title] = {
                to: child.relative,
                text: child.title
              };
            });
          } else if (link.below && alias === "Poets.org") {
            _.each(link.below, child => {
              midMenu[child.title] = {
                to: child.relative,
                text: child.title
              };
            });
          }
        });
        store.commit("updateTopMenu", links);
        store.commit("updateMidMenu", midMenu);
      })
      .catch(err => console.log(err));
  });

  inject("buildMobileMenu", ({ route, store }) => {
    return app.$axios
      .$get("/api/menu_items/mobileMenu")
      .then(res => {
        let mobileMenu = [];
        _.each(res, (link, i) => {
          mobileMenu[i] = {
            to: link.relative,
            text: link.title
          };
          if (link.below) {
            mobileMenu[i].children = [];
            _.each(link.below, (child, j) => {
              mobileMenu[i].children[j] = {
                to: child.relative,
                text: child.title
              };
            });
          }
        });
        store.commit("updateMobileMenu", mobileMenu);
      })
      .catch(err => console.log(err));
  });

  // Given the subMenu.json object, find the sub menu items for the provided
  // route.
  inject("buildSubMenu", ({ subMenu, route, store }) => {
    return app.$axios
      .$get("/api/menu_items/subMenu")
      .then(res => {
        let subMenu = {};
        let children = {};
        _.each(res, links => {
          if (links.below) {
            children = {};
            _.each(links.below, child => {
              children[child.title] = {
                to: child.relative
              };
            });
          }
          subMenu[links.title] = {
            to: links.relative,
            children
          };
        });
        // Function to recurse through subMenu.json.
        const findChildren = (uri, menus) => {
          let value = {};

          // We've reached a dead end; bail.
          if (_.isEmpty(menus)) return;

          // Go through each menu item; if it's a match with route, we've found our
          // subMenu.
          _.each(menus, function(item) {
            if (item.to === uri && _.isEmpty(item.children)) {
              value = menus;
            }
          });

          // If we haven't found our item, recurse until we do.
          if (_.isEmpty(value)) {
            _.each(menus, function(item) {
              if (!_.isEmpty(findChildren(uri, item.children))) {
                value = findChildren(uri, item.children);
              }
            });
          }

          return value;
        };
        store.commit("updateSubMenu", findChildren(route.path, subMenu));
      })
      .catch(err => console.log(err));
  });

  inject("buildFooterMenu", ({ route, store }) => {
    return app.$axios
      .$get("/api/menu_items/footer")
      .then(res => {
        const porgFootMenu = _.find(res, link => {
          return link.title === "poets.org";
        });
        const aapFootMenu = _.find(res, link => {
          return link.title === "academy of american poets";
        });
        const npmFootMenu = _.find(res, link => {
          return link.title === "national poetry month";
        });
        const apmFootMenu = _.find(res, link => {
          return link.title === "american poets";
        });
        const utilityFooter = _.find(res, link => {
          return link.title === "utility footer";
        });
        store.commit("updatePorgFootMenu", porgFootMenu.below);
        store.commit("updateAapFootMenu", aapFootMenu.below);
        store.commit("updateNpmFootMenu", npmFootMenu.below);
        store.commit("updateApmFootMenu", apmFootMenu.below);
        store.commit("updateUtilityFooter", utilityFooter.below);
      })
      .catch(err => console.log(err));
  });

  /**
   * Abstract away the ugliness of pulling a related entity
   */
  inject("getRelated", util.getRelated);

  /*
   * NOTE: we should move this someplace it makes more sense like some sort
   * of helper utils that parses api responses into component data
   */
  inject("latestMagazine", (magazine = {}) => {
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
        to: `/membership`,
        text: "Become a member"
      }
    };
  });
};
