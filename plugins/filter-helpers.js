import _ from "lodash";

export default {
  getFilterOptions(app, url, fieldName, dataType) {
    return app.$axios
      .get(url, {
        params: {
          fieldName
        }
      })
      .then(res => {
        let opts = {};
        _.each(res.data.data, i => {
          if (dataType == "taxonomy") {
            opts[i.attributes.name] = i.attributes.tid;
          } else if (dataType == "node") {
            opts[i.attributes.nid] = i.attributes.title;
          }
        });
        return {
          options: opts
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
};
