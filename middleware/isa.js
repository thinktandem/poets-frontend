import _ from "lodash";

/**
 * @param {Object} context
 *   NuxtJS context
 */
export default function(context) {
  const isaQuery = {
    query: {
      filter: {
        route: context.route.path
      }
    }
  };
  context.app.$api
    .getIsa(isaQuery)
    .then(res => {
      const data = _.get(res, "data.data[0]", null);
      let isa = null;
      if (data) {
        isa = {
          isaTitle: _.get(data, "attributes.title"),
          isaBody: _.get(data, "attributes.body.value"),
          isaShow: true
        };
      }
      context.store.commit("updateIsa", isa);
    })
    .catch(err => console.log(err));
}
