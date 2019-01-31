import _ from "lodash";

export default {
  /*
   * Swap out inline content images with full URL.
   */
  async imgUrl(content, app) {
    const baseURL = process.env.API_URL;
    const regex = /(\[\[)/;
    const myJson = content.split(regex);
    if (myJson.length > 1) {
      let endJson = "";
      let imgs = [];
      _.each(myJson, (val, i) => {
        const newVal = val.split(/\]\]/);
        endJson = newVal[newVal.length - 1];
        _.each(newVal, item => {
          if (item.charAt(0) === "{") {
            imgs.push(JSON.parse(item));
          }
        });
      });
      const myImg = await app.$axios
        .get(`/api/file/${imgs[0].fid}`, {})
        .then(res => {
          return baseURL + res.data[0].url;
        })
        .catch(err => {
          console.log(err);
        });

      return { myJson, myImg, endJson };
    } else {
      return {};
    }
  },
  staticUrl(content) {
    const baseURL = process.env.API_URL;
    const contentWithImages = content.replace(
      /\/sites\/default\/files\//g,
      baseURL + "/sites/default/files/"
    );

    return contentWithImages;
  }
};
