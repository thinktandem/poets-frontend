/**
 * @file
 * Version 2 node client for Poets API
 *
 * Interstitial CTAs, aka isa.
 */

/**
 * Get an isa.
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getIsa(request, options = {}) {
  return request("/api/node/isa", {}, options);
}

export default { getIsa };
