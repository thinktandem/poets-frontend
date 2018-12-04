const talkback = require("talkback");

const opts = {
  host: process.env.DRUPAL_URL,
  port: 80,
  path: "./test/tapes",
  record: process.env.RECORD_REQUESTS,
  ignoreBody: true,
  ignoreHeaders: [
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-port",
    "x-forwarded-proto",
    "x-forwarded-server",
    "x-real-ip",
    "set-cookie",
    "date",
    "cookie",
    "if-none-match",
    "user-agent",
    "upgrade-insecure-requests",
    "cache-control",
    "referer",
    "connection"
  ],
  fallbackMode: "proxy"
};

const server = talkback(opts);

server.start(() => console.log("Talkback started!"));
