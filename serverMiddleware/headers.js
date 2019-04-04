module.exports = function(req, res, next) {
  const ttl = parseInt(process.env.CACHE_TTL);
  res.setHeader("Cache-Control", `max-age=${ttl}`);
  next();
};
