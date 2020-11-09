import _ from "lodash";
import qs from "qs";
import url from "url";

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
 * @param {Array} collector The type to grab
 * @return {Object} the response object
 */
export function getTerm(
  request,
  term,
  options = {},
  type = "taxonomy_term",
  collector = []
) {
  return request(`/api/${type}/${term}`, {}, options).then(data => {
    collector = collector.concat(_.get(data, "data.data", []));
    if (_.has(data, "data.links.next.href")) {
      const query = qs.parse(url.parse(data.data.links.next.href).query);
      return getTerm(
        request,
        term,
        _.merge({}, options, { query }),
        type,
        collector
      );
    } else {
      data.data.data = collector;
      return data;
    }
  });
}

/**
 * Helper function to get a taxonomy term tid from the term name.
 *
 * @param {Object} request the axios library
 * @param {String} filter the vocabulary
 * @param {string} term the term name
 * @param {array} options the query options array
 * @param {string} type of drupal object to query
 * @return {string} the tid of the drupal taxonomy term
 */
export function getTermId(
  request,
  filter,
  term,
  options = {},
  type = "taxonomy_term"
) {
  let fixedTerm = "";
  term = _.split(term, "-");
  _.each(term, (word, i) => {
    if (i > 0) {
      fixedTerm += " " + _.upperFirst(word);
    } else {
      fixedTerm += _.upperFirst(word);
    }
  });
  return request(`/api/${type}/${filter}`, options).then(res => {
    const data = res.data.data;
    const termId = _.find(data, datum => {
      return datum.attributes.name === fixedTerm;
    });
    return termId.attributes.drupal_internal__tid;
  });
}

export default { getTerm, getTermId };
