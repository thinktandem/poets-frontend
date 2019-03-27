import _ from "lodash";

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
  }
};
