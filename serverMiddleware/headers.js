module.exports = function(req, res, next) {
  res.setHeader("Cache-Control", `max-age=${process.env.CACHE_TTL}`);
  next();
};
