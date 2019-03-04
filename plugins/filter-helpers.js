import _ from "lodash";
import qs from "qs";

export default {
  getFilterOptions(app, url, fieldName, dataType) {
    const fields = qs.stringify(fieldName);
    return app.$axios
      .get(url, {
        params: {
          fields
        }
      })
      .then(res => {
        let opts = {};
        _.each(res.data.data, i => {
          if (dataType == "taxonomy") {
            opts[i.attributes.name] = i.attributes.drupal_internal__tid;
          } else if (dataType == "node") {
            opts[i.attributes.drupal_internal__nid] = i.attributes.title;
          }
        });
        return {
          options: opts
        };
      })
      .catch(err => {
        console.log(err);
      });
  }
};
