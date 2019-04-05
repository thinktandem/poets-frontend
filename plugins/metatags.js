import _ from "lodash";

export default {
  /**
   * Generates the metatags.
   *
   * @param {Object} data The object that contains the tags.
   *
   * @return {Object} The tags results.
   */
  renderTags(data) {
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
        .value(),
      __dangerouslyDisableSanitizers: ["script"],
      script: [
        {
          innerHTML: this.structuredData(data),
          type: "application/ld+json"
        }
      ]
    };
  },

  structuredData(data) {
    return _.get(
      _.find(data, metatag => _.get(metatag, "tag") === "rendered_schema"),
      "attributes"
    );
  }
};
