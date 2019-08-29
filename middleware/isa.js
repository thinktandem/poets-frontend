import _ from "lodash";

/**
 * @param {Object} context
 *   NuxtJS context
 */
export default function(context) {
  const isaQuery = {
    query: {
      filter: {
        route: {
          operator: "CONTAINS",
          path: "route",
          value: context.route.path
        }
      }
    }
  };
  context.app.$api
    .getIsa(isaQuery)
    .then(res => {
      const rawData = _.get(res, "data.data", null);
      const data = _.find(rawData, (myData, i) => {
        const routes = _.split(myData.attributes.route, ",");
        let myIsa = null;
        _.forEach(routes, route => {
          if (route.trim() === context.route.path) {
            myIsa = myData;
          }
        });

        return myIsa;
      });
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
