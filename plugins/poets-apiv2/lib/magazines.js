import _ from "lodash";

/**
 * @file
 * Version 2 node client for Poets API
 *
 * magazines
 */

// Defaults options to get the latest mag
const latestOpts = {
  query: {
    filter: {
      status: 1
    },
    sort: "-changed",
    page: {
      limit: 1
    },
    include: "field_image,field_content_sections"
  }
};

/**
 * Get magazines
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getLatestMagazine(request, options = {}) {
  return request("/api/node/magazine", {}, _.merge({}, latestOpts, options));
}

/**
 * Get magazines
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getMagazines(request, options = {}) {
  return request("/api/node/magazine", {}, options);
}

export default { getLatestMagazine, getMagazines };
