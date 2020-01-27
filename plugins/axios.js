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
  $axios.onResponse(response => {
    // Handle decoupled router redirects.
    if (
      _.get(response, "data.redirect") &&
      // don't follow loops
      _.get(_.first(_.get(response, "data.redirect")), "from") ===
        _.get(_.first(_.get(response, "data.redirect")), "to")
    ) {
      console.log("redirect", response.data.redirect);
      redirect(
        [_.get(_.first(_.get(response, "data.redirect")), "status")],
        _.get(_.first(_.get(response, "data.redirect")), "to")
      );
    }
  });
}
