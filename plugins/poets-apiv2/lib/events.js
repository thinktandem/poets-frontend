import _ from "lodash";

/**
 * @file
 * Version 2 node client for Poets API
 *
 * Events
 */

// Event creation defaults
const eventCreateDefaults = (title = "My Event") => ({
  type: "node--events",
  attributes: {
    title,
    metatag_normalized: []
  }
});

/**
 * Create Events
 *
 * @param {Object} request The axios library
 * @param {Object|Array} data An object or array of objects
 * @param {Object} options Options
 * @return {Object} the response object
 */
export function create(request, data, options = {}) {
  // Normalize to array if needed
  if (!_.isArray(data)) data = [data];
  // Make all the requestz
  return Promise.all(
    _(data)
      .map(event =>
        request(
          "/api/node/events",
          _.merge({}, eventCreateDefaults(event.title), event),
          _.merge({}, options, { method: "post" })
        )
      )
      .value()
  );
}

export default { create };
