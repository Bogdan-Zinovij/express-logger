const { metrics } = require('../metrics/prometheus');

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  const path = req.path.toLowerCase();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route ? req.route.path : path;
    const status = res.statusCode;

    metrics.httpRequestsTotal.inc({
      method: req.method,
      route,
      status,
    });

    metrics.httpRequestDurationMicroseconds.observe(
      { method: req.method, route, status },
      duration / 1000 // duration in seconds
    );
  });

  next();
};

module.exports = metricsMiddleware;
