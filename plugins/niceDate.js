export default {
  /**
   * Transform date strings to standard Poets.org format (M D, Y).
   *
   * @param {string} date
   *   The date to manipulate.
   *
   * @param {string} format
   *  Optionally provide format of "year" or "full" full is default.
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
    let months = [
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
    return preparedMonth + " " + preparedDate + ", " + preparedYear;
  }
};
