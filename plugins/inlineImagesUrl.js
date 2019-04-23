import _ from "lodash";

export default {
  staticUrl(content) {
    const baseURL = process.env.API_URL || "https://api.poets.org";
    if (_.isEmpty(content)) {
      return content;
    }
    return content
      .replace(
        /src\=\"\/sites\/default\/files\//g,
        'src="' + baseURL + "/sites/default/files/"
      )
      .replace(
        /href\=\"\/sites\/default\/files\//g,
        'href="' + baseURL + "/sites/default/files/"
      );
  }
};
