/**
 * @file
 * Version 2 node client for Poets API
 *
 * Membership content type.
 */

import _ from "lodash";

const defaultOpts = {
  query: {
    filter: {
      status: 1
    }
  }
};
/**
 * Get a membership.
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getMembership(request, options = {}) {
  return request(
    `/api/node/membership/${options.id}`,
    {},
    _.merge({}, defaultOpts, options)
  );
}

/**
 * Get the uuid of a membership via route.
 *
 * @param {Object} request The axios library
 * @param {String} options
 * @return {String} the uuid of the sustainer node.
 */
export function getUuidViaRoute(request, options = {}) {
  return request(`/router/translate-path?path=${options.route}`);
}

export default { getMembership, getUuidViaRoute };
