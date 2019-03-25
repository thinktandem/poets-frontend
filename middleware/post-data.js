import { get } from "lodash";
import { parse } from "qs";

/**
 * @param {Object} context
 * @return {void}
 */
export default function({ req, res, store }) {
  if (get(req, "method", "GET") === "POST") {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", () => {
        store.commit("updatePostData", parse(body));
        resolve(parse(body));
      });
      req.on("error", error => reject({ oneall: error }));
    });
  }
}
