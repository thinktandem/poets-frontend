import _ from "lodash";
export default {
  // Map paragraph types to image styles
  imageStyles: {
    "paragraph--resource": "resource_image",
    "paragraph--sidebar_text_and_image": "resource_image",
    "paragraph--slideshow": "slide",
    "paragraph--image": "image_block",
    "media--image": "feature"
  },
  handleMultiImage(field) {
    return field.data.constructor === Array && field.data.length > 1
      ? _.get(_.first(field.data), "id")
      : _.get(field.data, "id");
  },
  handleFieldImage(item) {
    const fieldImage = _.get(item, "relationships.field_image");
    return fieldImage ? handleMultiImage(fieldImage) : null;
  },
  findMediaImage(page, imageField) {
    return _.find(page.included, include => {
      const mediaItem = _.find(
        page.included,
        include => include.id === imageField.id
      );
      return include.id === mediaItem.relationships.field_image.data.id;
    });
  },
  handleSideImage(page, item) {
    const sideImage = _.get(item, "relationships.side_image");
    return sideImage.data.constructor === Array && sideImage.length >= 1
      ? this.findMediaImage(page, _.first(sideImage.data))
      : this.findMediaImage(page, sideImage.data);
  },

  handleDefaultImage(item) {
    return (
      _.get(item, "relationships.image.data") ||
      _.get(item, "relationships.image.target_uuid")
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
    const image = this.handleDefaultImage(item);
    const fieldImage = this.handlFieldImage(item);
    const sideImage = this.handleSideImage(page, item);
    return image || fieldImage || sideImage;
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

  /**
   * Build an image object
   *
   * @param {Object} entity
   *  Drupal entity from API
   * @param {Object} page
   *  Drupal page object from API
   * @return {Object} an object for vue to render an image
   */
  buildImg(entity, page) {
    // Try to get the right imagestyle, fallback to thumbnail.
    const imageStyle = this.imageStyles[entity.type] || "thumbnail";
    // Try to find the image object.
    const img = _.find(
      page.included,
      include => include.id === this.getImgPath(entity, page)
    );
    return this.getImgPath(entity, page)
      ? {
          src:
            img !== undefined && img.links.hasOwnProperty(imageStyle)
              ? img.links[imageStyle].href
              : "",
          alt: this.buildAlt(entity, page)
        }
      : null;
  },
  buildMedia(media, page) {
    if (media === undefined || media === null) {
      return null;
    }
    switch (media.type) {
      case "media--image":
        return {
          img: this.buildImg(media, page)
        };
      case "media--video_embed":
        return {
          video: _.get(media, "attributes.field_media_video_embed_field")
        };
    }
  }
};
