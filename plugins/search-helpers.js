export default {
  /**
   * Load up the search results.
   *
   * @param {string} url the api end point to query.
   * @param {Object} app The app.
   * @param {Object} query The query string as an Object.
   *
   * @return {Object} The search results.
   */
  getSearchResults(url, app, query) {
    return app.$axios
      .get(url, {
        params: query
      })
      .then(res => {
        let prevPageNum = 0;
        if (res.data.pager.current_page > 0) {
          prevPageNum = res.data.pager.current_page - 1;
        }
        let nextPageNum = 0;
        if (res.data.pager.current_page + 1 < res.data.pager.total_pages) {
          nextPageNum = res.data.pager.current_page + 1;
        }
        const myQuery = app.router.history.current.query;
        let preparedState = "";
        let preparedSchool = "";
        let preparedCombine = "";
        if (query.state) preparedState = "&state=" + query.state;
        if (query.school) preparedSchool = "&school=" + query.school;
        if (query.combine) preparedCombine = "&combine=" + query.combine;
        if (query.theme)
          preparedTheme = "&field_poem_themes_target_id=" + query.theme;
        if (query.occasions)
          preparedOccasions = "&field_occasion_target_id=" + query.occasions;
        if (query.form)
          preparedForm = "&field_form_target_id=" + query.occasions;

        return {
          results: res.data.rows,
          pageNum: res.data.pager.current_page || "",
          Prev: prevPageNum || "",
          Next: nextPageNum || "",
          currentPage: res.data.pager.current_page || "",
          totalPages: res.data.pager.total_pages || "",
          combine: myQuery.combine || "",
          page: myQuery.page || "",
          school: myQuery.school || "",
          state: myQuery.state || "",
          preparedState: preparedState || "",
          preparedSchool: preparedSchool || "",
          preparedCombine: preparedCombine || ""
        };
      })
      .catch(err => {
        console.log(err);
      });
  }
};
