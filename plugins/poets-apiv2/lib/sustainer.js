/**
 * @file
 * Version 2 node client for Poets API
 *
 * Sustainer content type.
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
 * Get a sustainer.
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getSustainer(request, options = {}) {
  return request(
    `/api/node/sustainer/${options.id}`,
    {},
    _.merge({}, defaultOpts, options)
  );
}

/**
 * Get the uuid of a sustainer via route.
 *
 * @param {Object} request The axios library
 * @param {String} options
 * @return {String} the uuid of the sustainer node.
 */
export function getUuidViaRoute(request, options = {}) {
  return request(
    `/router/translate-path?path=${options.route}`
    // "/router/translate-path?path=`${route}`");
  );
  // return res.entity.uuid;
}

export default { getSustainer, getUuidViaRoute };
