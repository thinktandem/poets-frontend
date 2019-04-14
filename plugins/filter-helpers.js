import _ from "lodash";

export default {
  /*
   * Helper to maps data to vue bootstrap options
   */
  map2Options(
    data,
    text = "attributes.name",
    value = "attributes.drupal_internal__tid"
  ) {
    return _(data)
      .map(datum => ({
        text: _.get(datum, text),
        value: _.get(datum, value)
      }))
      .sortBy("text")
      .value();
  }
};
