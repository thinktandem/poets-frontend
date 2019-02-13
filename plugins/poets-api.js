/**
 * @file
 * Provide some helpers for interacting with the Poets API
 */

import * as _ from "lodash";

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

// Map paragraph types to image styles
const imageStyles = {
  "paragraph--resource": "resource_image",
  "paragraph--sidebar_text_and_image": "resource_image",
  "paragraph--slideshow": "slide",
  "paragraph--image": "image_block",
  "media--image": "feature"
};

/**
 * Fetch the image uuid.
 *
 * @note This is a little funky, we're cascading through possible field names
 *  and it isn't clear what the best order is, or how we handle a component with
 *  multiple images.
 *
 * @todo Make this not awful
 *
 * @param {Object} item
 *  data from Drupal
 * @param {Object} page
 *  page object from Drupal
 * @return {String|null} Either the ID or null if can't be found
 */
const getImgPath = (item, page) => {
  if (
    item.relationships.hasOwnProperty("image") &&
    item.relationships.image.data !== null
  ) {
    return (
      item.relationships.image.data.target_uuid ||
      item.relationships.image.data.id
    );
  } else if (
    item.relationships.hasOwnProperty("field_image") &&
    item.relationships.field_image.data.length > 1
  ) {
    return _.first(item.relationships.field_image.data).id;
  } else if (item.relationships.hasOwnProperty("field_image")) {
    return item.relationships.field_image.data.id;
  } else if (
    item.relationships.hasOwnProperty("side_image") &&
    item.relationships.side_image.hasOwnProperty("data") &&
    item.relationships.side_image.data.hasOwnProperty("id") &&
    item.relationships.side_image.data.id !== null
  ) {
    return _.find(page.included, include => {
      const mediaItem = _.find(
        page.included,
        include => include.id === item.relationships.side_image.data.id
      );
      return include.id === mediaItem.relationships.field_image.data.id;
    }).id;
  } else if (
    item.relationships.hasOwnProperty("side_image") &&
    item.relationships.side_image.hasOwnProperty("data") &&
    item.relationships.side_image.data.constructor === Array &&
    item.relationships.side_image.data.length >= 1
  ) {
    return _.find(page.included, include => {
      const mediaItem = _.find(
        page.included,
        include => include.id === _.first(item.relationships.side_image.data).id
      );
      return include.id === mediaItem.relationships.field_image.data.id;
    }).id;
  } else {
    return null;
  }
};

/**
 * Fetch the file uuid
 *
 * @param {Object} item
 *  data from Drupal
 * @return {String|null} Either the ID or null if can't be found
 */
const getFilePath = item => {
  if (
    item.relationships.hasOwnProperty("resource_file") &&
    item.relationships.resource_file.data !== null
  ) {
    return item.relationships.resource_file.data.id;
  } else {
    return null;
  }
};

/**
 * Build an alt string
 *
 * @param {Object} entity
 *  Drupal entity from API
 * @param {Object} page
 *  Drupal page object from API
 * @return {String} an alt string
 */
const buildAlt = (entity, page) => {
  const imgPath = getImgPath(entity, page);
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
};

/**
 * Build an image object
 *
 * @param {Object} entity
 *  Drupal entity from API
 * @param {Object} page
 *  Drupal page object from API
 * @return {Object} an object for vue to render an image
 */
const buildImg = (entity, page) => {
  // Try to get the right imagestyle, fallback to thumbnail.
  const imageStyle = imageStyles[entity.type] || "thumbnail";
  // Try to find the image object.
  const img = _.find(
    page.included,
    include => include.id === getImgPath(entity, page)
  );
  return getImgPath(entity, page)
    ? {
        src:
          img !== undefined && img.links.hasOwnProperty(imageStyle)
            ? img.links[imageStyle].href
            : "",
        alt: buildAlt(entity, page)
      }
    : null;
};

/**
 * Build an array of slides for slideshow components
 *
 * @param {Object} entity
 *  Paragraph entity to build out the slides for
 * @param {Object} page
 *  The Drupal page object
 * @return {Array} An array of slide definitions to render component.
 */
const buildSlides = (entity, page) => {
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
};

/**
 * Handle the verbose checking for possibly empty fields
 *
 * @param {Object} entity
 *  Entity object from Drupal API
 * @param {String} field
 *  The Field name to check
 * @return {mixed} the field value or null
 */
const maybeField = (entity, field) => {
  return entity.hasOwnProperty("attributes") &&
    entity.attributes.hasOwnProperty(field) &&
    entity.attributes[field] !== null
    ? entity.attributes[field]
    : null;
};

/**
 * Generic function to build a component from Drupal data
 *
 * @param {Object} item
 *  Data object representing a component
 * @param {Object} page
 *  Data object representing the parent page
 * @return {Object} the formatted data to load a vue component
 */
const buildComponent = (item, page) => {
  const entity = _.find(page.included, include => include.id === item.id);
  return {
    component: components[entity.type] || "ResourceCard",
    props: {
      title: entity.attributes.title,
      body:
        maybeField(entity, "body") !== null
          ? maybeField(entity, "body").processed
          : null,
      img: buildImg(entity, page),
      file: getFilePath(entity)
        ? _.find(page.included, include => include.id === getFilePath(entity))
        : null,
      sidebarTop:
        maybeField(entity, "side_text_1") !== null
          ? maybeField(entity, "side_text_1").processed
          : null,
      sidebarBottom:
        maybeField(entity, "side_text_2") !== null
          ? maybeField(entity, "side_text_2").processed
          : null,
      slides: buildSlides(item, page),
      youtubeId: maybeField(entity, "youtube_id"),
      vimeoId: maybeField(entity, "vimeo_id")
    }
  };
};

/**
 * Build up the sidebar data region
 *
 * @param {Object} page
 *  The page data from Drupal
 * @return {Object}
 *  formatted sidebar area data
 */
const buildSidebar = page =>
  _(page.data.relationships.sidebar_sections.data)
    .map(item => buildComponent(item, page))
    .value();

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
const buildHighlightedData = page =>
  _(page.data.relationships.highlighted_content.data)
    .map(item => {
      const entity = _.find(page.included, include => include.id === item.id);
      return {
        title: entity.attributes.title,
        img: getImgPath(entity, page)
          ? {
              src: _.find(
                page.included,
                include => include.id === getImgPath(entity, page)
              ).links.thumbnail.href,
              alt: _.first(entity.relationships.field_image.data).meta.alt
            }
          : null,
        text:
          entity.attributes.hasOwnProperty("body") &&
          entity.attributes.body !== null
            ? entity.attributes.body.summary || entity.attributes.body.processed
            : "",
        titleLink: entity.attributes.path.alias
      };
    })
    .value();

/**
 * Build the extended content region
 *
 * @param {Object} page
 *  Page data from Drupal
 * @return {Object} formatted data for extended region
 */
const buildExtendedContentSection = page =>
  _(page.data.relationships.field_content_sections.data)
    .map(item => buildComponent(item, page))
    .value();

const buildMedia = (media, page) => {
  if (media === undefined || media === null) {
    return null;
  }
  switch (media.type) {
    case "media--image":
      return {
        img: buildImg(media, page)
      };
    case "media--video_embed":
      return {
        video: media.attributes.field_media_video_embed_field
      };
  }
};

const buildFeaturedContentSection = page =>
  _(page.data.relationships.featured.data)
    .map(item => {
      const referencedContent = _.find(
        page.included,
        include => include.id === item.id
      );
      const media = _.find(
        page.included,
        include =>
          include.id ===
          _.get(referencedContent, "relationships.featured_media.data.id", null)
      );
      return Object.assign(
        {
          title: referencedContent.attributes.title,
          subtitle: referencedContent.attributes.featured_meta,
          text: referencedContent.attributes.body.processed
        },
        buildMedia(media, page)
      );
    })
    .value();

export default ({ app }, inject) => {
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
        const page = JSON.parse(response.data["Page#uri{0}"].body);

        store.commit("updateHero", {
          variant: "default",
          heading: page.data.attributes.title,
          lead: page.data.attributes.hasOwnProperty("lead_text")
            ? page.data.attributes.lead_text
            : null
        });
        // Set the main page data
        store.commit("updatePageData", page);
        const sidebarData = buildSidebar(page);
        store.commit("updateSidebarData", sidebarData);
        // Handle the content in the 'highlighted' area.
        const highlightedData = buildHighlightedData(page);
        store.commit("updateHighlightedData", highlightedData);
        const extendedContent = buildExtendedContentSection(page);
        store.commit("updateExtendedContent", extendedContent);
        const featuredContent = buildFeaturedContentSection(page);
        store.commit("updateFeaturedContent", featuredContent);
      });
  });
};
