const http = require("http");
const yakbak = require("yakbak");

http
  .createServer(
    yakbak(process.env.DRUPAL_URL, {
      dirname: __dirname + "/test/tapes"
    })
  )
  .listen(process.env.PROXY_PORT);
