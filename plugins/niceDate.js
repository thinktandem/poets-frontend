export default {
  /**
   * Transform date strings to standard Poets.org format (M D, Y).
   *
   * @param {string} date
   *   The date to manipulate.
   *
   * @param {string} format
   *  Optionally provide format of "year", "full", or "long" full is default.
   *  year: ex. 1974
   *  full: ex. May 18, 2019
   *  long: ex. Sat, May 18, 2019
   *
   * @return {string}
   */
  niceDate(date, format = "full") {
    if (date === null) {
      return "";
    }
    let niceDate = new Date(date);
    if (format === "year") {
      return niceDate.getFullYear();
    }
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let preparedDate = niceDate.getDate();
    let preparedMonth = months[niceDate.getMonth()];
    let preparedYear = niceDate.getFullYear();
    const formatFull = preparedMonth + " " + preparedDate + ", " + preparedYear;
    if (format === "full") {
      return formatFull;
    } else if (format === "long") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let preparedDay = days[niceDate.getDay()];
      return preparedDay + ", " + formatFull;
    }
  },

  /*
   * https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
   *
   * We need to compare MySQL Datetimes to MySQL Datetimes to get the sorting.
   */
  twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
  },

  getMysqlFormat() {
    const d = new Date(Date.now());
    return (
      d.getUTCFullYear() +
      "-" +
      this.twoDigits(1 + d.getUTCMonth()) +
      "-" +
      this.twoDigits(d.getUTCDate()) +
      " " +
      this.twoDigits(d.getUTCHours()) +
      ":" +
      this.twoDigits(d.getUTCMinutes()) +
      ":" +
      this.twoDigits(d.getUTCSeconds())
    );
  }
};
