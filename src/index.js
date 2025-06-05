const express = require('express');
const logger = require('./logger/fluentLogger');
const prometheusMetrics = require('./metrics/prometheus');
const metricsMiddleware = require('./middleware/metricsMiddleware');
const errorHandler = require('./middleware/errorMiddleware');
const setupMetricsApp = require('./metrics/setupMetricsServer');

const app = express();
const PORT = 5000;
const HOST = 'localhost';
const METRICS_PORT = 9091;

app.use(metricsMiddleware);

app.get('/', (req, res) => {
  logger.info('GET / — main page has been opened');
  res.send('Welcome to the main page!');
});

app.get('/debug', (req, res) => {
  logger.debug('GET /debug — debug completed');
  res.send('Debug message send');
});

app.get('/error', (req, res) => {
  logger.error('GET /error — something goes wrong');
  res.status(500).send('Error occurred');
});

app.get('/throw-error', (req, res, next) => {
  try {
    throw new Error('This is a demo error thrown by the application');
  } catch (err) {
    next(err);
  }
});

const metricsApp = setupMetricsApp();

app.listen(PORT, HOST, () => {
  logger.info(`Main server listening on http://localhost:${PORT}`);
});

metricsApp.listen(METRICS_PORT, () => {
  logger.info(
    `Metrics server listening on http://localhost:${METRICS_PORT}/metrics`
  );
});

app.use(errorHandler);
