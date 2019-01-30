import qs from "qs";

/**
 * Set the parameter serialization scheme for axios.
 * @param {Object} $axios
 * @param {Object} app
 * @param {Object} store
 */
export default function({ $axios, app, store }) {
  $axios.onRequest(config => {
    config.headers.common["X-Consumer-ID"] = process.env.CONSUMER_ID;
    config.paramsSerializer = params =>
      qs.stringify(params, { arrayFormat: "brackets", encode: false });
    return config;
  });
}
