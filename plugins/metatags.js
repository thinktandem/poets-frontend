import _ from "lodash";

export default {
  /**
   * Generates the metatags.
   *
   * @param {Object} route The object that contains the route.
   * @param {Object} data The object that contains the tags.
   * @param {array} overrides Any Metatag overrides.
   *
   * @return {Object} The tags results.
   */
  renderTags(route, data, overrides = []) {
    let headScripts = [
      {
        innerHTML: this.structuredData(data),
        type: "application/ld+json"
      }
    ];
    if (
      route.path === "/" ||
      route.path === "/poem-a-day" ||
      route.path === "/national-poetry-month"
    ) {
      const powerAd = [{ src: "https://powerad.ai/script.js" }];
      headScripts = _.merge(headScripts, powerAd);
    }

    return {
      title: _.get(
        _.find(data, metatag => _.get(metatag, "attributes.name") === "title"),
        "attributes.content"
      ),
      meta: _(data)
        .filter(
          metatag =>
            _.get(metatag, "attributes.schema_metatag", false) === false
        )
        .map(metatag => ({
          hid: metatag.attributes.name,
          name: metatag.attributes.name,
          content: metatag.attributes.content
        }))
        .merge(overrides)
        .push({
          hid: "canonical",
          rel: "canonical",
          href: `https://poets.org${route.fullPath}`
        })
        .value(),
      __dangerouslyDisableSanitizers: ["script"],
      script: headScripts
    };
  },

  structuredData(data) {
    return _.get(
      _.find(data, metatag => _.get(metatag, "tag") === "rendered_schema"),
      "attributes"
    );
  }
};
