import _ from "lodash";
import Oneall from "oneall";
import { parse } from "qs";

// List of oneall props
const oneAllProps = [
  "connection_token",
  "identity_vault_key",
  "oa_action",
  "oa_social_login_token"
];

// Helper to validate oneall
const validateOneAll = (data = {}) => {
  // Make sure the data is full
  if (_.isEmpty(data)) {
    return false;
  }

  // Make sure we have all the props we need
  _.forEach(oneAllProps, key => {
    if (!_.has(data, "key")) return false;
  });

  // Make sure all the props are as they should be
  // NOTE: we do a REALLY weak UUID check here, maybe @TODO upgrade in the future?
  if (data.oa_action !== "social_login") return false;
  if (_.size(data.connection_token.split("-") !== 5)) return false;
  if (_.size(data.oa_social_login_token.split("-") !== 5)) return false;

  // We are good!
  return true;
};

/**
 * @param {Object} context
 * @return {void}
 */
export default function({ req, res, store }) {
  if (_.get(req, "method", "GET") === "POST") {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(parse(body));
      });
      req.on("error", error => reject({ oneall: error }));
    })
      .then(data => {
        // Do some special handling for oneall usertoken so that this all runs server side
        if (validateOneAll(data)) {
          return new Promise((resolve, reject) => {
            const oneall = new Oneall({
              endpoint: "https://poets.api.oneall.com",
              publickey: process.env.ONEALL_PUBLIC_KEY,
              privatekey: process.env.ONEALL_PRIVATE_KEY
            });
            oneall.connection.get(
              data.connection_token,
              (err, data, fullData) => {
                if (err) reject(err);
                else resolve(_.get(fullData, "response.result.data.user", {}));
              }
            );
          });
        } else {
          return data;
        }
      })
      .then(data => store.commit("updatePostData", data));
  }
}
