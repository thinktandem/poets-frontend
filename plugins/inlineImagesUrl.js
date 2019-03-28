import _ from "lodash";

export default {
  staticUrl(content) {
    const baseURL = process.env.API_URL || "https://api.poets.org";
    if (_.isEmpty(content)) {
      return content;
    }
    const contentWithImages = content.replace(
      /src\=\"\/sites\/default\/files\//g,
      'src="' + baseURL + "/sites/default/files/"
    );

    return contentWithImages;
  }
};
