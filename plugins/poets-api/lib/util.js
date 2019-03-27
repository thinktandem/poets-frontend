import _ from "lodash";
import media from "./media";
import imgUrl from "~/plugins/inlineImagesUrl";
// Map paragraph types from Drupal to VueJS components.
const components = {
  "paragraph--image": "ImageBlock",
  "paragraph--media": "MediaBlock",
  "paragraph--resource": "ResourceCard",
  "paragraph--sidebar_text_and_image": "SidebarTextImage",
  "paragraph--slideshow": "SlideshowBlock",
  "paragraph--standard_text": "StandardTextBlock",
  "paragraph--video": "VideoBlock"
};
export default {
  /**
   * Fetch the file uuid
   *
   * @param {Object} item
   *  data from Drupal
   * @return {String|null} Either the ID or null if can't be found
   */
  getFilePath(item) {
    if (
      item.relationships.hasOwnProperty("resource_file") &&
      item.relationships.resource_file.data !== null
    ) {
      return item.relationships.resource_file.data.id;
    } else {
      return null;
    }
  },

  getRelated(topLevelResponse = {}, entity = null, relationship = "") {
    return _.find(
      _.get(topLevelResponse, "included"),
      include =>
        _.get(include, "id") ===
        _.get(
          _.first(_.get(entity, `relationships.${relationship}.data`)),
          "id"
        )
    );
  },

  firstOrOnly(data) {
    if (_.isArray(data)) {
      return _.first(data);
    } else {
      return data;
    }
  },
  /**
   * Build an array of slides for slideshow components
   *
   * @param {Object} entity
   *  Paragraph entity to build out the slides for
   * @param {Object} page
   *  The Drupal page object
   * @return {Array} An array of slide definitions to render component.
   */
  buildSlides(entity, page) {
    if (entity.type !== "paragraph--slideshow") {
      return null;
    }

    const paragraph = _.find(
      page.included,
      included => entity.id === included.id
    );

    return _.map(paragraph.relationships.side_image.data, related => {
      const mediaItem = _.find(
        page.included,
        include => related.id === include.id
      );
      const imageFile = _.find(
        page.included,
        include => mediaItem.relationships.field_image.data.id === include.id
      );

      return {
        img: {
          src: imageFile.links.slide.href,
          alt: mediaItem.relationships.field_image.data.meta.alt
        },
        text: mediaItem.relationships.field_image.data.meta.title
      };
    });
  },

  /**
   * Handle the verbose checking for possibly empty fields
   *
   * @param {Object} entity
   *  Entity object from Drupal API
   * @param {String} field
   *  The Field name to check
   * @return {mixed} the field value or null
   */
  maybeField(entity, field) {
    return this.firstOrOnly(_.get(entity, `attributes.${field}`));
  },

  buildProcessable(entity, field = "body", summary = false) {
    const maybeField = _.get(entity, `attributes.${field}`);
    if (maybeField) {
      return _.isArray(maybeField) && maybeField.length > 0
        ? _.map(maybeField, function(value) {
            return imgUrl.staticUrl(value.processed);
          })
        : imgUrl.staticUrl(maybeField.processed);
    } else {
      return "";
    }
  },

  buildFile(entity, page) {
    return this.getFilePath(entity)
      ? _.find(
          page.included,
          include => include.id === this.getFilePath(entity)
        )
      : null;
  },

  /**
   * Generic function to build a component from Drupal data
   *
   * @param {Object} item
   *  Data object representing a component
   * @param {Object} page
   *  Data object representing the parent page
   * @return {Object} the formatted data to load a vue component
   */
  buildComponent(item, page) {
    const entity = _.find(page.included, include => include.id === item.id);
    if (entity === undefined) {
      return {};
    }
    let mediaItem = entity;
    const entityType = _.get(entity, "type");
    if (entityType === "paragraph--sidebar_text_and_image") {
      _.get(entity, "relationships.side_image.data");
      mediaItem = _.find(
        page.included,
        include =>
          include.id ===
          _.get(
            this.firstOrOnly(_.get(entity, "relationships.side_image.data")),
            "id"
          )
      );
    }
    const sidebarTop = this.buildProcessable(entity, "side_text_1");
    const sidebarBottom = this.buildProcessable(entity, "side_text_2");

    return {
      component: components[entityType] || "ResourceCard",
      props: {
        title: _.get(entity, "attributes.title", ""),
        body: this.buildProcessable(entity),
        img: media.buildImg(
          page,
          mediaItem,
          "field_image",
          media.imageStyles[entityType]
        ),
        file: this.buildFile(entity, page),
        sidebarTop: _.isArray(sidebarTop) ? sidebarTop : [sidebarTop],
        sidebarBottom: _.isArray(sidebarBottom)
          ? sidebarBottom
          : [sidebarBottom],
        slides: this.buildSlides(item, page),
        youtubeId: this.maybeField(entity, "youtube_id"),
        vimeoId: this.maybeField(entity, "vimeo_id"),
        moreLink: this.maybeField(entity, "more_link")
      }
    };
  }
};
