import _ from "lodash";
import qs from "qs";

export default {
  /*
   * @DEPRECATED
   * Use map2Options instead
   * @NOTE: Do not delete this until all invocations are gone
   */
  async getFilterOptions(app, url, fieldName, dataType) {
    const fields = qs.stringify(fieldName);
    let allOpts = {};
    let opts = {};
    do {
      opts = await app.$axios
        .get(url, {
          params: {
            fields
          }
        })
        .then(res => {
          return {
            options: this.getFilterSet(res.data.data, fieldName, dataType),
            links: _.get(res, "data.links.next", null)
          };
        })
        .catch(err => {
          console.log(err);
        });

      allOpts = _.merge(allOpts, opts.options);
      url = _.get(opts, "links.href", null);
    } while (url);

    return {
      options: allOpts
    };
  },
  /*
   * Helper function to get a set of 50 elements.
   */
  getFilterSet(data, fieldName, dataType) {
    let nextOpts = {};
    _.each(data, i => {
      if (dataType == "taxonomy") {
        nextOpts[i.attributes.drupal_internal__tid] = i.attributes.name;
      } else if (dataType == "node") {
        nextOpts[i.attributes.drupal_internal__nid] = i.attributes.title;
      }
    });

    return nextOpts;
  },
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
