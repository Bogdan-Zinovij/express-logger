const logger = require('../logger/fluentLogger');
const { metrics } = require('../metrics/prometheus');

const errorHandler = (err, req, res) => {
  const statusCode = res.statusCode ?? 500;
  const route = req.route ? req.route.path : req.path;

  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode,
  });

  metrics.errorsTotal.inc({
    type: err.name || 'Unknown Error',
    message: err.message.substring(0, 50),
  });

  metrics.httpErrorsTotal.inc({
    method: req.method,
    route,
    status_code: statusCode,
  });

  res.status(statusCode);
  res.json({ message: err.message });
};

module.exports = errorHandler;
