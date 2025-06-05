const express = require('express');
const logger = require('../logger/fluentLogger');
const prometheusMetrics = require('./prometheus');

function setupMetricsApp() {
  const metricsApp = express();

  metricsApp.get('/metrics', async (req, res) => {
    try {
      res.set('Content-Type', prometheusMetrics.register.contentType);
      const metrics = await prometheusMetrics.register.metrics();

      res.end(metrics);
    } catch (err) {
      logger.error('Error generating metrics', { error: err.message });

      res.status(500).end(err);
    }
  });

  return metricsApp;
}

module.exports = setupMetricsApp;
