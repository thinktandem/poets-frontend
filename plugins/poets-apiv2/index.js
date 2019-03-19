import _ from "lodash";
import qs from "qs";
import anthologies from "~/plugins/poets-apiv2/lib/anthologies";
import user from "~/plugins/poets-apiv2/lib/user";

/**
 * @file
 * Version 2 node client for Poets API
 */

// Post request config
const defaultRequestOptions = {
  headers: {
    "Content-Type": "application/vnd.api+json"
  }
};

// Helper to build a url
const buildUrl = (url, query = {}) => {
  if (!_.isEmpty(query)) {
    const queryString = qs.stringify(query);
    url = `${url}?${queryString}`;
  }
  return url;
};

// Helper to process a request
const request = axios => {
  return (
    url,
    data = {},
    { method = "get", query = {}, options = {} } = {}
  ) => {
    return axios[method](
      buildUrl(url, query),
      { data },
      _.merge({}, defaultRequestOptions, options)
    );
  };
};

/**
 * PoetsAPI
 */
export default class PoetsApi {
  /**
   * Constructor
   *
   * @param {Object} axios library
   * @param {Object} options
   */
  constructor(axios, options = {}) {
    this.request = request(axios);
    this.options = options;
  }

  /**
   * Create Anthologies
   *
   * @param {Object|Array} data An object or array of objects
   * @param {Object} options Options
   * @return {Object} the response object
   */
  createAnthologies(data, options = {}) {
    return anthologies.create(this.request, data, options);
  }

  /**
   * Get Anthologies
   *
   * @param {Object} options
   * @return {Object} the response object
   */
  getAnthologies(options = {}) {
    return anthologies.get(this.request, options);
  }

  /**
   * Update Anthologies
   *
   * @param {Object|Array} data An object or array of objects
   * @param {Object} options Options
   * @return {Object} the response object
   */
  updateAnthologies(data, options = {}) {
    return anthologies.update(this.request, data, options);
  }

  /**
   * Get Anthologies
   *
   * @param {String} id the user id
   * @param {Object} options
   * @return {Object} the response object
   */
  getUser(id, options = {}) {
    return user.get(this.request, id, options);
  }
}
