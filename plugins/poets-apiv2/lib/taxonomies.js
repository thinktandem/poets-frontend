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
 * @param {String} type The type to grab
 * @return {Object} the response object
 */
export function getTerm(request, term, options = {}, type = "taxonomy_term") {
  return request(`/api/${type}/${term}`, {}, options);
}

export default { getTerm };
