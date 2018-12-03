export default {
  getPageLinks(query) {
    let Prev = 0;
    let pageNum = 0;
    let Next = 1;
    if ("page" in query) {
      pageNum = query.page;
      if (pageNum > 0) {
        Prev = pageNum - 1;
      }
      Next = Number(pageNum) + 1;
    }
    return {
      pageNum: pageNum,
      Prev: Prev,
      Next: Next
    };
  },
  getNumPages(app, url, numPerPage) {
    return app.$axios
      .get(url, {
        params: {
          "fields[node--poems]": "status",
          "filter[status]": 1
        }
      })
      .then(res => {
        const total = res.data.meta.count;
        const pages = Math.floor(total / numPerPage);
        return {
          numPages: pages
        };
      })
      .catch(err => {
        console.log(err);
      });
  }
};
