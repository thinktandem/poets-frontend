import _ from "lodash";
import qs from "qs";

/**
 * Set the parameter serialization scheme for axios.
 * @param {Object} $axios
 * @param {Object} app
 * @param {Object} store
 */
export default function({ $axios, redirect }) {
  $axios.onRequest(config => {
    config.headers.common["X-Consumer-ID"] = process.env.CONSUMER_ID;
    config.paramsSerializer = params =>
      qs.stringify(params, { arrayFormat: "brackets", encode: false });
    return config;
  });
  // $axios.onResponse(response => {
  // if (response.status === 207) {
  // const routerCode = _.get(response, "data.router.headers.status", []);
  // if (_.indexOf(routerCode, 404) !== -1) {
  // console.log("Router response was", _.get(response, "data.router.body"));
  // redirect("/sorry");
  // }
  // }
  // return response;
  // });
  // $axios.onError(error => {
  // console.log(error.response);
  // redirect("/sorry");
  // });
}
