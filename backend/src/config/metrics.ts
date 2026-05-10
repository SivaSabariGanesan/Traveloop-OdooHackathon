import client from 'prom-client';

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// ─── Custom metrics ───────────────────────────────────────────────────────────

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const activeConnections = new client.Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register],
});

export const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
});

// ─── Gemini API metrics ───────────────────────────────────────────────────────

export const geminiRequestTotal = new client.Counter({
  name: 'gemini_requests_total',
  help: 'Total number of Gemini API calls',
  labelNames: ['operation', 'status'],
  registers: [register],
});

export const geminiRequestDuration = new client.Histogram({
  name: 'gemini_request_duration_seconds',
  help: 'Duration of Gemini API calls in seconds',
  labelNames: ['operation'],
  buckets: [0.5, 1, 2, 3, 5, 10, 20],
  registers: [register],
});

export const geminiTokensUsed = new client.Counter({
  name: 'gemini_tokens_used_total',
  help: 'Estimated total tokens used in Gemini API calls',
  labelNames: ['operation'],
  registers: [register],
});

export { register };
