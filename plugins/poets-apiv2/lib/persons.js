import _ from "lodash";

/**
 * @file
 * Version 2 node client for Poets API
 *
 * Persons
 * There are different types of persons on the site: poets and contributors.
 * Contributors are further broken down into: staff, board, chancellors, and
 * education advisory committee. Each having past and present members.
 *
 * Poets get there own handling in the poets-apiv2/lib/poets.js.
 */

// Defaults options
const defaultsOpts = {
  query: {
    filter: {
      status: 1
    }
  }
};

/**
 * Get persons
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getPersons(request, options = {}) {
  return request("/api/node/person", {}, _.merge({}, defaultsOpts, options));
}

export default { getPersons };
