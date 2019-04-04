const axios = require("axios");
const _ = require("lodash");

module.exports = {
  /*
   * Get paginated data /node/TYPE endpoints and gather up url
   * aliases for the sitemap.
   *
   * @TODO: changefreq
   */
  async getUrlAliases(next, priority = 0.9) {
      let urls = [];
      let routes = {};
      const date = new Date().toISOString().substr(0, 19);
      let urlsIndex = 0;
    do {
      routes = await axios
        .get(next, {
          filter: {
            status: 1
          }
        })
        .then(async res => {
          const poems = await res.data.data.map(
            poem => {
              return {
                alias: _.get(poem, "attributes.path.alias", null),
                type: _.get(poem, "type", null)
              };
            }
          );
          // type is for logging.
          let type = "";
          _.each(poems, (poem, i) => {
            if (poem) {
              type = poem.type;
              if (type === "node--person") {
                priority = (_.get(res, "data.data.attributes.field_p_type") === "poet")
                  ? 0.9
                  : 0.8;
              }
              const path = _.get(poem, "alias", "");
              if (path !== "") {
                urls[urlsIndex] = {
                  url: path,
                  priority: priority,
                  changedfreq: "always",
                  lastmodISO: date
                };
                if (_.isEmpty(urls[urlsIndex])) { console.log("last: ", urls[urlsIndex]); }
                urlsIndex = urlsIndex + 1;
              }
            }
          });
          console.log(
            "INFO - sitemap-helper: ",
            _.size(urls),
            " of " + type + " recorded to the sitemap."
          );
          next = _.get(res, "data.links.next.href", null);
        })
        .catch(err => console.log(err));
    } while (next !== null);

    return urls;
  },
  async allTheUrls() {
    const base = "https://api-poetsd8.lndo.site";
    let allUrls = [];

    const poems = await this.getUrlAliases(
      base + "/api/node/poems",
      0.9
    );
    allUrls = allUrls.concat(poems);

    const people = await this.getUrlAliases(
      base + "/api/node/person",
      0.9
    );
    allUrls = allUrls.concat(people);

    // const anthologies = await this.getUrlAliases(
    //   base + "/api/node/anthologies",
    //   0.7
    // );
    // allUrls = allUrls.concat(anthologies);

    // const basic_pages = await this.getUrlAliases(
    //   base + "/api/node/basic_page",
    //   0.5
    // );
    // allUrls = allUrls.concat(basic_pages);

    // @TODO: There is a problem w/ books import somewhere above 400th book.
    const books = await this.getUrlAliases(
      base + "/api/node/books",
      0.8
    );
    allUrls = allUrls.concat(books);
    //const collections = await this.getUrlAliases(
    //  base + "/api/node/collections",
    //  0.8
    // );
    // allUrls = allUrls.concat(collections);

    // const events = await this.getUrlAliases(
    //   base + "/api/node/events",
    //   0.5
    // );
    // allUrls = allUrls.concat(events);

    // const institution = await this.getUrlAliases(
    //   base + "/api/node/institution",
    //   0.5
    // );
    // allUrls = allUrls.concat(institution);

    // const lesson_plans = await this.getUrlAliases(
    //   base + "/api/node/lesson_plans",
    //   0.5
    // );
    // allUrls = allUrls.concat(lesson_plans);

    // const listing = await this.getUrlAliases(
    //   base + "/api/node/listing",
    //   0.5
    // );
    // allUrls = allUrls.concat(listing);

    // const magazine = await this.getUrlAliases(
    //   base + "/api/node/magazine",
    //   0.5
    // );
    // allUrls = allUrls.concat(magazine);

    // const prize_or_program = await this.getUrlAliases(
    //   base + "/api/node/prize_or_program",
    //   0.5
    // );
    // allUrls = allUrls.concat(prize_or_program);

    // const state = await this.getUrlAliases(
    //   base + "/api/node/state",
    //   0.5
    // );
    // allUrls = allUrls.concat(state);

    // const sub_prize_or_program = await this.getUrlAliases(
    //   base + "/api/node/sub_prize_or_program",
    //   0.5
    // );
    // allUrls = allUrls.concat(sub_prize_or_program);

    // const teach_this_poem = await this.getUrlAliases(
    //   base + "/api/node/teach_this_poem",
    //   0.5
    // );
    // allUrls = allUrls.concat(teach_this_poem);

    //const texts = await this.getUrlAliases(
    //  base + "/api/node/texts",
    //  0.5
    //);
    //allUrls = allUrls.concat(texts);

    console.log("Recorded ", _.size(allUrls), " total URLs to the sitemap.");

    return allUrls;
  }
};
