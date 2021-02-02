import _ from "lodash";
import util from "./util";

const baseURL = process.env.API_URL || "https://api.poets.org";

export default {
  // Map paragraph types to image styles
  imageStyles: {
    "node--basic_page": "media_aside",
    "paragraph--resource": "resource_image",
    "paragraph--sidebar_text_and_image": "media_aside_lg",
    "paragraph--slideshow": "slide",
    "paragraph--image": "image_block",
    "media--image": "feature"
  },

  buildHeroBg(page) {
    const mediaItem = _.find(page.included, include => {
      return (
        _.get(include, "id") ===
        _.get(page, "data.relationships.hero_background.data.id")
      );
    });
    const randomFallbackNumber = Math.floor(Math.random() * 6);
    return this.buildImg(page, mediaItem, "field_image", "hero_bg", {
      src: `/hero/bg${randomFallbackNumber}.jpg`
    });
  },
  handleMultiImage(field) {
    return _.get(field, "data.constructor", {}) === Array &&
      _.get(field, "data", []).length > 1
      ? _.get(_.first(field.data), "id", null)
      : _.get(field.data, "id", null);
  },
  handleFieldImage(item) {
    const fieldImage = _.get(item, "relationships.field_image");
    return fieldImage ? this.handleMultiImage(fieldImage) : null;
  },
  findMediaImage(page, imageField) {
    const imgObject = _.find(page.included, include => {
      const mediaItem = _.find(
        page.included,
        include => include.id === _.get(imageField, "id")
      );
      return (
        include.id === _.get(mediaItem, "relationships.field_image.data.id")
      );
    });

    return _.get(imgObject, "id", null);
  },
  handleSideImage(page, item) {
    const sideImage = _.get(item, "relationships.side_image.data", null);
    return sideImage && sideImage.constructor === Array && sideImage.length >= 1
      ? this.findMediaImage(page, _.first(sideImage))
      : null;
  },

  /**
   * Handles the "image" field in Drupal.
   * @param {Object} item
   *  structured object representing entity from Drupal.
   * @return {String|null} UUID or null
   */
  handleDefaultImage(item) {
    return (
      _.get(item, "relationships.image.data.id", null) ||
      _.get(item, "relationships.image.data.target_uuid", null)
    );
  },
  /**
   * Fetch the image uuid. This function cascades through multiple possible image fields to look for an id.
   *
   * @param {Object} item
   *  data from Drupal
   * @param {Object} page
   *  page object from Drupal
   * @return {String|null} Either the ID or null if can't be found
   */
  getImgPath(item, page) {
    return (
      this.handleDefaultImage(item) ||
      this.handleFieldImage(item) ||
      this.handleSideImage(page, item)
    );
  },
  /**
   * Build an alt string
   *
   * @param {Object} entity
   *  Drupal entity from API
   * @param {Object} page
   *  Drupal page object from API
   * @return {String} an alt string
   */
  buildAlt(entity, page) {
    const imgPath = this.getImgPath(entity, page);
    const related = _.find(
      entity.relationships,
      relationship => _.get(relationship, "data.id", null) === imgPath
    );
    if (related !== undefined) {
      return related.data.meta.alt;
    } else {
      const media = _.find(page.included, include => {
        // is a media item and is related to entity...
        return (
          include.type === "media--image" &&
          _.find(
            entity.relationships,
            relationship => relationship.data.id === include.id
          ) !== undefined
        );
      });
      return media !== undefined &&
        media.hasOwnProperty("relationships") &&
        media.relationships !== null &&
        media.relationships.hasOwnProperty("field_image")
        ? media.relationships.field_image.data.meta.alt
        : "";
    }
  },

  /*
   * @param {Object} topLevelResponse
   *   The top level json api reponse from Drupal with Entity and included key
   *   that contains related entities.
   * @param {Object|null} entity
   *   This can be a one of the related entities that has the image field to
   *   pull, i.e. the image you want is not on the topLevelResponse, but one
   *   of the included entities.
   * @param {String} relationship
   *   The field name of the image field default "field_image"
   * @param {String} imageStyle
   *   The image style that you want from drupal, i.e. non exhaustive: portrait,
   *   thumbnail, etc.
   * @param {Object} fallback
   *   If we can not get the image we can pass a default image at call time.
   */
  buildImg(
    topLevelResponse = {},
    entity = null,
    relationship = "field_image",
    imageStyle = "thumbnail",
    fallback = {}
  ) {
    const prioritizedEntity = entity || topLevelResponse.data;
    const related = util.firstOrOnly(
      _.get(prioritizedEntity, `relationships.${relationship}.data`)
    );
    const file = _.find(
      _.get(topLevelResponse, "included"),
      include => _.get(include, "id") === _.get(related, "id")
    );
    let src = "";
    if (_.get(file, `links.${imageStyle}.href`, null)) {
      src = _.get(file, `links.${imageStyle}.href`, "");
    } else {
      console.log(baseURL);
      src = baseURL + _.get(file, "attributes.uri.url", "");
    }
    return file !== undefined
      ? {
          src,
          alt: _.get(related, "meta.alt", null),
          title: _.get(related, "meta.title", null)
        }
      : fallback;
  },
  /**
   * Build an image object
   *
   * @param {Object} media
   *  Drupal entity from API
   * @param {Object} page
   *  Drupal page object from API
   * @return {Object} an object for vue to render an image
   */
  buildMedia(media, page) {
    if (media === undefined || media === null) {
      return null;
    }
    switch (media.type) {
      case "media--image":
        return {
          img: this.buildImg(
            page,
            media,
            "field_image",
            this.imageStyles[media.type]
          )
        };
      case "media--video_embed":
        return {
          video: _.get(media, "attributes.field_media_video_embed_field")
        };
    }
  }
};
