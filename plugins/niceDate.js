export default {
  /**
   * Transform date strings to standard Poets.org format (M D, Y).
   *
   * @param {string} date
   *   The date to manipulate.
   *
   * @return {string}
   */
  niceDate(date) {
    let niceDate = new Date(date);
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
