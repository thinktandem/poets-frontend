import _ from "lodash";

/**
 * @file
 * Version 2 node client for Poets API
 *
 * Events
 */

// Event creation defaults
const eventCreateDefaults = ({
  title,
  email,
  fee,
  date,
  street,
  city,
  state,
  zip,
  summary = ""
} = {}) => ({
  type: "node--events",
  attributes: {
    body: {
      value: summary
    },
    field_event_contact: email,
    field_event_date: date,
    field_event_fee: fee,
    field_location: {
      country_code: "US",
      administrative_area: state,
      locality: city,
      postal_code: zip,
      address_line1: street
    },
    metatag_normalized: [],
    title
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
          _.merge({}, eventCreateDefaults(event), event),
          _.merge({}, options, { method: "post" })
        )
      )
      .value()
  );
}

export default { create };
