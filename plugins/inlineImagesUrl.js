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
  },
  /**
   * Truncate text to 300 chars.
   *
   * @param {String} text
   *
   * @return {String}
   */
  teaserText(text) {
    return text.length > 300
      ? `${text.substr(0, text.lastIndexOf(" ", 300))}...`
      : text;
  },
  allowIframeNavToTop(content) {
    return content.replace(
      /<iframe /g,
      "<iframe sandbox='allow-popups allow-same-origin allow-top-navigation-by-user-activation' "
    );
  }
};
