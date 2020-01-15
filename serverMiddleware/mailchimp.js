/**
 * @file
 * Middleware to serve as a twitter proxy. Note since we're on Nuxt 1.x,
 * this uses old school node modules instead of ES6 modules.
 */

const Mailchimp = require("mailchimp-api-v3");
const _ = require("lodash");
const express = require("express");
const cors = require("cors");
const hostValidation = require("host-validation");
const bodyParser = require("body-parser");

const buildInterests = lists => {
  const interests = {
    "poem-a-day": "07de9ac192",
    "academy-newsletter": "e5c20f18e3",
    "teach-this-poem": "bdbd7d1108",
    "education-newsletter": "451185a00f"
  };
  const mapped = _.map(lists, list => {
    return [interests[list], true];
  });

  return _.fromPairs(mapped);
};

/**
 * Simple endpoint to proxy the fetching of tweets
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @return {void}
 */
module.exports = async function(req, res) {
  const app = express();

  // Only allow posts and only from our own domain.
  app.use(
    cors({
      origin: process.env.APP_URL,
      methods: ["POST"]
    })
  );
  app.use(
    hostValidation({
      hosts: [
        "poetsd8.lndo.site",
        // "localhost",
        "poets.org",
        /.*\.poets\.org$/
      ]
    })
  );
  app.use(bodyParser.json());
  app.use(function(req, res) {
    if (req.method !== "POST") {
      res.writeHead(400);
      return res.end("Invalid Request");
    }

    const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
    mailchimp
      .post(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
        email_address: req.body.email,
        status: "subscribed",
        interests: buildInterests([req.body.list])
      })
      .then(result => {
        console.log("Mailchimp Result", result);
        res.writeHead(201);
        res.end("Subscribed!");
      })
      .catch(err => {
        console.log("Mailchimp Error", err);
        res.writeHead(500);
        res.end("Error!");
      });
  });
  return app.handle(req, res);
};
