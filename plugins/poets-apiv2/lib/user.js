/**
 * @file
 * Version 2 node client for Poets API
 *
 * User
 */

/**
 * Get User
 * @TODO: what if we need to get more than one user?
 *
 * @param {Object} request The axios library
 * @param {String} id the user ID
 * @param {Object} options
 * @return {Object} the response object
 */
export function get(request, id, options = {}) {
  return request(`/api/user/user/${id}`, {}, options);
}

export default { get };
