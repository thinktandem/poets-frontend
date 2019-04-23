import _ from "lodash";
import media from "./media";
import util from "./util";
export default {
  buildGenericSection(page, section) {
    return (
      _(_.get(page, `data.relationships[${section}].data`))
        .map(item => util.buildComponent(item, page))
        // We're defaulting to true here in case a paragraph doesn't implement
        // the status field
        .filter(item => _.get(item, "attributes.status", true))
        .value() || []
    );
  },
  /**
   * Build up the sidebar data region
   *
   * @param {Object} page
   *  The page data from Drupal
   * @return {Object}
   *  formatted sidebar area data
   */
  buildSidebar(page) {
    return this.buildGenericSection(page, "sidebar_sections");
  },

  /**
   * Build up the highlighted data region
   *
   * @param {Object} page
   *  The page data from Drupal
   * @return {Object}
   *  formatted highlighted area data
   *
   * @todo refactor to be more deterministic
   */
  buildHighlightedData(page) {
    return (
      _(page.data.relationships.highlighted_content.data)
        .filter(item => _.get(item, "attributes.status", true))
        .map(item => {
          const entity = _.find(
            page.included,
            include => include.id === item.id
          );
          return {
            title: entity.attributes.title,
            img: media.buildImg(page, entity, "field_image"),
            text:
              entity.attributes.hasOwnProperty("body") &&
              entity.attributes.body !== null
                ? entity.attributes.body.summary ||
                  entity.attributes.body.processed
                : "",
            titleLink: entity.attributes.path.alias
          };
        })
        .value() || []
    );
  },

  /**
   * Build the extended content region
   *
   * @param {Object} page
   *  Page data from Drupal
   * @return {Object} formatted data for extended region
   */
  buildExtendedContentSection(page) {
    return this.buildGenericSection(page, "field_content_sections");
  },

  buildFeaturedContentSection(page) {
    return (
      _(page.data.relationships.featured.data)
        .filter(item => _.get(item, "attributes.status", true))
        .map(item => {
          const referencedContent = _.find(
            page.included,
            include => include.id === item.id
          );
          const featuredMedia = _.find(
            page.included,
            include =>
              include.id ===
              _.get(referencedContent, "relationships.featured_media.data.id")
          );
          return Object.assign(
            {
              title: _.get(referencedContent, "attributes.title", null),
              subtitle: _.get(
                referencedContent,
                "attributes.featured_meta",
                null
              ),
              text: _.get(referencedContent, "attributes.body.processed", null),
              link: _.get(referencedContent, "attributes.path.alias", null)
            },
            media.buildMedia(featuredMedia, page)
          );
        })
        .value() || []
    );
  }
};
