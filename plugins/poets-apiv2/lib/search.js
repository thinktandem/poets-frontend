/**
 * @file
 * Version 2 node client for Poets API
 *
 * Search mechanisms
 */

/**
 * Get audio searchable by options
 *
 * @param {Object} request The axios library
 * @param {Object} options The request options
 * @return {Object} the response object
 */
export function audio(request, options = {}) {
  return request("/api/audio_poems", {}, options);
}

/**
 * Get books searchable by options
 *
 * @param {Object} request The axios library
 * @param {Object} options The request options
 * @return {Object} the response object
 */
export function books(request, options = {}) {
  return request("/api/books_list", {}, options);
}

/**
 * Get plans searchable by options
 *
 * @param {Object} request The axios library
 * @param {Object} options The request options
 * @return {Object} the response object
 */
export function lessonPlans(request, options = {}) {
  return request("/api/lesson_plans", {}, options);
}

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
 * Get previous poem-a-days searchable by options
 *
 * @param {Object} request The axios library
 * @param {Object} options The request options
 * @return {Object} the response object
 */
export function previousPoemsADay(request, options = {}) {
  return request("/api/previous-poems", {}, options);
}

/**
 * Get search searchable by options
 *
 * @param {Object} request The axios library
 * @param {Object} options The request options
 * @return {Object} the response object
 */
export function search(request, options = {}) {
  return request("/api/search", {}, options);
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

export default {
  audio,
  books,
  lessonPlans,
  poems,
  poets,
  previousPoemsADay,
  search,
  texts
};
