const promClient = require('prom-client');

const register = new promClient.Registry();

promClient.collectDefaultMetrics({ register });

// HTTP request counter - counts total http requests by route and method
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// HTTP request duration in seconds - measures request processing time
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10], // buckets for response time from 10ms to 10s
  registers: [register],
});

// Logger counter - count events by log level
const loggerEventsTotal = new promClient.Counter({
  name: 'logger_events_total',
  help: 'Total number of logger events',
  labelNames: ['level'],
  registers: [register],
});

// Memory usage
const memoryUsageGauge = new promClient.Gauge({
  name: 'nodejs_memory_usage_bytes',
  help: 'Memory usage of the Node.js process in bytes',
  labelNames: ['type'],
  registers: [register],
  collect() {
    const memoryUsage = process.memoryUsage();
    this.set({ type: 'rss' }, memoryUsage.rss);
    this.set({ type: 'heapTotal' }, memoryUsage.heapTotal);
    this.set({ type: 'heapUsed' }, memoryUsage.heapUsed);
    this.set({ type: 'external' }, memoryUsage.external);
  },
});

// Application errors counter by type
const errorsTotal = new promClient.Counter({
  name: 'app_errors_total',
  help: 'Total number of application errors',
  labelNames: ['type', 'message'],
  registers: [register],
});

// HTTP error responses (4xx, 5xx) counter
const httpErrorsTotal = new promClient.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP error responses',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

module.exports = {
  register,
  metrics: {
    httpRequestsTotal,
    httpRequestDurationMicroseconds,
    loggerEventsTotal,
    memoryUsageGauge,
    errorsTotal,
    httpErrorsTotal,
  },
};
