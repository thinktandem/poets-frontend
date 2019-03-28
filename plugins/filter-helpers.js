import _ from "lodash";
import qs from "qs";

export default {
  async getFilterOptions(app, url, fieldName, dataType) {
    const fields = qs.stringify(fieldName);
    // return app.$axios
    let allOpts = {};
    let opts = await app.$axios
      .get(url, {
        params: {
          fields
        }
      })
      .then(res => {
        return {
          options: this.getFilterSet(res.data.data, fieldName, dataType),
          links: _.get(res, "data.links.next")
        };
      })
      .catch(err => {
        console.log(err);
      });
    console.log("\n\n my links --\n\n", opts.links);
    allOpts = _.merge(allOpts, opts.options);
    while (opts.links) {
      opts = await app.$axios
        .get(qs.stringify(opts.links.href), {
          params: {
            fields
          }
        })
        .then(res => {
          console.log(
            "\n\nnext 50?\n",
            this.getFilterSet(res.data.data, fieldName, dataType)
          );
          return {
            options: this.getFilterSet(res.data.data, fieldName, dataType),
            links: _.get(res, "data.links.next")
          };
        })
        .catch(err => {
          console.log(err);
        });

      allOpts = _.merge(allOpts, opts.options);
    }

    return {
      options: allOpts
    };
  },
  /*
   * Helper function to get a set of 50 elements.
   */
  getFilterSet(data, fieldName, dataType) {
    let nextOpts = {};
    // _.each(res.data.data, i => {
    _.each(data, i => {
      if (dataType == "taxonomy") {
        nextOpts[i.attributes.name] = i.attributes.drupal_internal__tid;
      } else if (dataType == "node") {
        nextOpts[i.attributes.drupal_internal__nid] = i.attributes.title;
      }
    });
    return nextOpts;
  }
};
