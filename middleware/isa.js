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
          isaHeader: _.get(data, "attributes.header", null),
          isaBody: _.get(data, "attributes.body.value"),
          isaShow: true
        };
      }
      context.store.commit("updateIsa", isa);
      const isaCookie = context.app.$cookies.get("isa-" + context.route.path);
      if (isaCookie) {
        context.app.$cookies.set(
          "isa-" + context.route.path,
          {
            value: 1,
            route: context.route.path
          },
          {
            maxAge: 60 * 60 * 24
          }
        );
      }
    })
    .catch(err => console.log(err));
}
