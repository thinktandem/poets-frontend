export default {
  staticUrl(content) {
    const baseURL = process.env.API_URL;
    const contentWithImages = content.replace(
      /\/sites\/default\/files\//g,
      baseURL + "/sites/default/files/"
    );

    return contentWithImages;
  }
};
