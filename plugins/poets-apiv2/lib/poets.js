import _ from "lodash";

/**
 * @file
 * Version 2 node client for Poets API
 *
 * Poets
 */

// Defaults options to hone down on a poet person
const defaultsOpts = {
  query: {
    filter: {
      status: 1,
      field_p_type: "poet"
    }
  }
};

// Featured opts
const featuredOpts = {
  query: {
    filter: {
      status: 1,
      field_p_type: "poet"
    },
    page: {
      limit: 3
    },
    // @NOTE: this is an offhanded way to get results with images at the top
    // because for some reason fitlering to check image existence takes FOREVER
    sort: "-field_featured,-field_image.fid",
    include: "field_image"
  }
};

/**
 * Get featured poets stuff
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getFeaturedPoets(request, options = {}) {
  return request("/api/node/person", {}, _.merge({}, featuredOpts, options));
}

/**
 * Get poets stuff
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getPoets(request, options = {}) {
  return request("/api/node/person", {}, _.merge({}, defaultsOpts, options));
}

export default { getFeaturedPoets, getPoets };
