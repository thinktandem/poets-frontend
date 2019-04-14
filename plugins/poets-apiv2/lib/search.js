/**
 * @file
 * Version 2 node client for Poets API
 *
 * Search mechanisms
 */

/**
 * Get poems searchable by options
 *
 * @param {Object} request The axios library
 * @param {Object} options The request options
 * @return {Object} the response object
 */
export function poems(request, options = {}) {
  return request("/api/poems", {}, options);
}

/**
 * Get poets searchable by options
 *
 * @param {Object} request The axios library
 * @param {Object} options The request options
 * @return {Object} the response object
 */
export function poets(request, options = {}) {
  return request("/api/poets", {}, options);
}

/**
 * Get texts searchable by options
 *
 * @param {Object} request The axios library
 * @param {Object} options The request options
 * @return {Object} the response object
 */
export function texts(request, options = {}) {
  return request("/api/texts_list", {}, options);
}

export default { poems, poets, texts };
