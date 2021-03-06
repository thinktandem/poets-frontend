/**
 * @file
 * Version 2 node client for Poets API
 *
 * Poems
 */

/**
 * Get poem a day stuff
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getPoemADay(request, options = {}) {
  return request("/api/poem-a-day", {}, options);
}

/**
 * Get poems
 *
 * @param {Object} request The axios library
 * @param {Object} options
 * @return {Object} the response object
 */
export function getPoems(request, options = {}) {
  return request("/api/node/poems", {}, options);
}

export default { getPoems, getPoemADay };
