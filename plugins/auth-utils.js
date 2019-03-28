import _ from "lodash";
import dataUtils from "~/plugins/niceDate";

// Helper to build teh address line
const getAddress = (one = "", two = "") => `${one} ${two}`;

// Helper to build teh city line
// eslint-disable-next-line camelcase
const getCity = ({ locality, administrative_area, postal_code }) => {
  let line = "";
  if (locality) {
    line = locality;
  }
  // eslint-disable-next-line camelcase
  if (administrative_area || postal_code) {
    // eslint-disable-next-line camelcase
    line = `${line}, ${administrative_area} ${postal_code}`;
  }
  return line;
};

// Helper to get a nice data
const getDate = (date = "Never") => {
  if (date === "Never") return date;
  else {
    return dataUtils.niceDate(date);
  }
};

// Helper to build an address from user data
const getFullAddress = addr =>
  _.compact([
    getAddress(_.get(addr, "address_line1"), _.get(addr, "address_line2")),
    getCity(addr),
    _.get(addr, "country_code", "")
  ]).join("\n");

// Helper to build a name from user data
const getName = data => {
  const first = _.get(data, "field_first_name", "");
  const last = _.get(data, "field_last_name", "");
  return `${first} ${last}`;
};

export default {
  /**
   * Validates the status of a prop but return null instead of true
   *
   * @param {data} data to validate
   *
   * @return {Boolean} something.
   */
  getState(data = null) {
    if (!_.isEmpty(data)) return true;
    else return null;
  },

  /**
   * Validates an email
   *
   * @param {string} data the email
   *
   * @return {Boolean} whether we have an email or not.
   */
  isEmail(data) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(data);
  },

  /**
   * Maps user data to tableable data
   *
   * @param {Object} data the user data from user.getUser()
   * @param {Boolean} active the user is an active member or not
   *
   * @return {Array} Data we can use in a bootstrap table.
   */
  parseMembership(data = {}, active = false) {
    // This exist in both cases and should be at the end
    const table = [
      { key: "Latest Gift", value: _.get(data, "field_latest_gift", "none") }
    ];
    // Append to the table if we are active
    if (active) {
      table.unshift({
        key: "Membership Expires",
        value: getDate(_.get(data, "field_membership_expires_date"))
      });
      table.unshift({
        key: "Member Since",
        value: getDate(_.get(data, "field_membership_joined_date"))
      });
      table.unshift({
        key: "Membership Status",
        value: _.get(data, "field_membership_status", "Inactive")
      });
    }
    return table;
  },

  /**
   * Maps poem data from api.getAnthologyPoems to data for a list group
   *
   * @param {Object} data poem data
   *
   * @return {Array} Data we can use in a bootstrap table.
   */
  parsePoems(data = {}) {
    return _(data)
      .map(datum => ({
        id: _.get(datum, "id"),
        key: _.uniqueId(_.get(datum, "id")),
        title: _.get(datum, "attributes.title"),
        path: _.get(datum, "attributes.path.alias")
      }))
      .value();
  },

  /**
   * Maps user data to tableable data
   *
   * @param {Object} data the user data from user.getUser()
   *
   * @return {Array} Data we can use in a bootstrap table.
   */
  parseUser(data = {}) {
    return [
      { key: "Name", value: getName(data) },
      { key: "Email", value: _.get(data, "mail", "") },
      { key: "Phone", value: _.get(data, "field_phone", "") },
      {
        key: "Address",
        value: getFullAddress(_.get(data, "field_address", {}))
      }
    ];
  }
};
