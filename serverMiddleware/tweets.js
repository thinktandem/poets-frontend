/**
 * @file
 * Middleware to serve as a twitter proxy. Note since we're on Nuxt 1.x,
 * this uses old school node modules instead of ES6 modules.
 */
const Twit = require("twit");
const _ = require("lodash");
const config = {
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token: process.env.TWIT_ACCESS_TOKEN,
  access_token_secret: process.env.TWIT_TOKEN_SECRET
};
const T = new Twit(config);

/**
 * Simple endpoint to proxy the fetching of tweets
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @return {void}
 */
module.exports = async function(req, res) {
  return T.get("statuses/user_timeline", {
    screen_name: "POETSorg",
    count: 4,
    trim_user: true
  })
    .then(apiResponse => {
      const tweets = _.map(apiResponse.data, tweet => ({
        text: tweet.text,
        id_str: tweet.id_str,
        created_at: tweet.created_at
      }));
      // Response should always be JSON.
      res.setHeader("Content-Type", "application/json");
      // Only allow the app itself to call this route in a browser
      res.setHeader("Access-Control-Allow-Origin", req.headers.host);
      res.writeHead(200);
      res.end(JSON.stringify({ tweets }));
    })
    .catch(e => {
      res.writeHead(500);
      res.end(e.message);
    });
};
