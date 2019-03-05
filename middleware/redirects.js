import redirects from "~/redirects.json";
/**
 * Middleware to perform predefined redirects
 * @param {Object} req
 *  request object
 * @param {Object} res
 *  response object
 * @param {function} next
 *  the next middleware to load
 */
export default function(req, res, next) {
  const redirect = redirects.find(r => r.from === req.url);
  if (redirect) {
    console.log(`redirect: ${redirect.from} => ${redirect.to}`);
    res.writeHead(301, { Location: redirect.to });
    res.end();
  } else {
    next();
  }
}
