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

export default { getPoets };
