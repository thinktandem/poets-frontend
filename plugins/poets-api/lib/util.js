import _ from "lodash";
import media from "./media";
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
        caption: mediaItem.attributes.name,
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
    return entity.hasOwnProperty("attributes") &&
      entity.attributes.hasOwnProperty(field) &&
      entity.attributes[field] !== null
      ? entity.attributes[field]
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
    return {
      component: components[entity.type] || "ResourceCard",
      props: {
        title: entity.attributes.title,
        body:
          this.maybeField(entity, "body") !== null
            ? this.maybeField(entity, "body").processed
            : null,
        img: media.buildImg(entity, page),
        file: this.getFilePath(entity)
          ? _.find(
              page.included,
              include => include.id === this.getFilePath(entity)
            )
          : null,
        sidebarTop:
          this.maybeField(entity, "side_text_1") !== null
            ? this.maybeField(entity, "side_text_1").processed
            : null,
        sidebarBottom:
          this.maybeField(entity, "side_text_2") !== null
            ? this.maybeField(entity, "side_text_2").processed
            : null,
        slides: this.buildSlides(item, page),
        youtubeId: this.maybeField(entity, "youtube_id"),
        vimeoId: this.maybeField(entity, "vimeo_id")
      }
    };
  }
};
