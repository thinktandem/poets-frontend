/**
 * @file
 * Version 2 node client for Poets API
 *
 * Get taxonomies and terms
 */

/**
 * Get taxonomies
 *
 * @param {Object} request The axios library
 * @param {String} term The term to grab
 * @param {Object} options The request options
 * @return {Object} the response object
 */
export function getTerm(request, term, options = {}) {
  return request(`/api/taxonomy_term/${term}`, {}, options);
}

export default { getTerm };
