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

export default { getTerm };
