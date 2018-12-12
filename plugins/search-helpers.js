export default {
  /**
   * Load up the search results.
   *
   * @param {Object} app The app.
   * @param {Object} query The query string as an Object.
   *
   * @return {Object} The search results.
   */
  getSearchResults(app, query) {
    return app.$axios
      .get(`/api/search`, {
        params: {
          page: query.page || "",
          combine: query.combine || ""
        }
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
        return {
          results: res.data.rows,
          pageNum: res.data.pager.current_page,
          Prev: prevPageNum,
          Next: nextPageNum,
          currentPage: res.data.pager.current_page,
          totalPages: res.data.pager.total_pages,
          combine: myQuery.combine || "gff",
          page: myQuery.page || ""
        };
      })
      .catch(err => {
        console.log(err);
      });
  }
};
