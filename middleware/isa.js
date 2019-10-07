import _ from "lodash";

/**
 * @param {Object} context
 *   NuxtJS context
 */
function updateCookies({ app, route }) {
  if (app.$cookies.get("isa-" + route.path)) {
    app.$cookies.set(
      "isa-" + route.path,
      {
        value: 1,
        route: route.path
      },
      {
        maxAge: 60 * 60 * 24
      }
    );
  }
}

/**
 * @param {Object} res
 *   Response to process
 * @param {Object} context
 *   NuxtJS context
 */
function updateIsa(res, context) {
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
  updateCookies(context);
}

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
    .then(res => updateIsa(res, context))
    .catch(err => console.log(err));
}
