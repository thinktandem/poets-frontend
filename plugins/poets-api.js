import * as _ from "lodash";
export default ({ app }, inject) => {
  inject("buildBasicPage", (app, store, path) => {
    const getImgPath = item => {
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
        item.relationships.field_image.data.length >= 1
      ) {
        return _.first(item.relationships.field_image.data).id;
      } else {
        return null;
      }
    };

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

    const routerRequest = {
      requestId: "router",
      action: "view",
      uri: `/router/translate-path?path=${path}`
    };
    const pageRequest = {
      requestId: "Page",
      action: "view",
      headers: {
        Accept: "application/json",
        "X-CONSUMER-ID": process.env.CONSUMER_ID
      },
      uri: `{{router.body@$.jsonapi.individual}}?include=field_content_sections.image,highlighted_content.field_image,field_content_sections.resource_file`,
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
        // Set the sidebar
        const components = {
          "paragraph--resource": "ResourceCard",
          "paragraph--video": "VideoBlock",
          "paragraph--image": "ImageBlock"
        };
        const sidebarData = _(page.included)
          .filter(item => Object.keys(components).includes(item.type))
          .map(item => {
            const imageStyles = {
              "paragraph--resource": "resource_image",
              "paragraph--image": "image_block"
            };
            return {
              component: components[item.type] || "ResourceCard",
              props: {
                title: item.attributes.title,
                body:
                  item.attributes.hasOwnProperty("body") &&
                  item.attributes.body !== null
                    ? item.attributes.body.processed
                    : null,
                img: getImgPath(item)
                  ? {
                      src: _.find(
                        page.included,
                        include => include.id === getImgPath(item)
                      ).links[imageStyles[item.type]].href,
                      alt: item.relationships.image.data.meta.alt
                    }
                  : null,
                file: getFilePath(item)
                  ? _.find(
                      page.included,
                      include => include.id === getFilePath(item)
                    )
                  : null,
                youtubeId:
                  item.attributes.hasOwnProperty("youtube_id") &&
                  item.attributes.youtube_id !== null
                    ? item.attributes.youtube_id
                    : null,
                vimeoId:
                  item.attributes.hasOwnProperty("vimeo_id") &&
                  item.attributes.vimeo_id !== null
                    ? item.attributes.vimeo_id
                    : null
              }
            };
          })
          .value();
        store.commit("updateSidebarData", sidebarData);
        // Handle the content in the 'highlighted' area.
        const highlightedData = _(page.included)
          .filter(item => item.type.includes("node"))
          .map(item => {
            return {
              title: item.attributes.title,
              img: getImgPath(item)
                ? {
                    src: _.find(
                      page.included,
                      include => include.id === getImgPath(item)
                    ).links.thumbnail.href,
                    alt: _.first(item.relationships.field_image.data).meta.alt
                  }
                : null,
              text:
                item.attributes.hasOwnProperty("body") &&
                item.attributes.body !== null
                  ? item.attributes.body.summary ||
                    item.attributes.body.processed
                  : "",
              titleLink: item.attributes.path.alias
            };
          })
          .value();
        store.commit("updateHighlightedData", highlightedData);
      });
  });
};
