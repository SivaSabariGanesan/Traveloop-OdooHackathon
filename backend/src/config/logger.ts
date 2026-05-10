import winston from 'winston';
import LokiTransport from 'winston-loki';

const isDev = process.env.NODE_ENV !== 'production';
const lokiUrl = process.env.LOKI_URL || 'http://localhost:3100';
const appName = process.env.APP_NAME || 'traveloop';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const extra = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
        return `${timestamp} [${level}] ${message}${extra}`;
      })
    ),
  }),
];

// Only add Loki transport when Loki is configured
if (process.env.LOKI_URL) {
  try {
    transports.push(
      new LokiTransport({
        host: lokiUrl,
        labels: { app: appName, env: process.env.NODE_ENV || 'development' },
        json: true,
        format: winston.format.json(),
        replaceTimestamp: true,
        silenceErrors: true,
        gracefulShutdown: false,
        onConnectionError: (err) => {
          const code = (err as any).code;
          if (code === 'ECONNREFUSED') {
            console.warn(`⚠️  Loki not reachable at ${lokiUrl} — logs won't be shipped`);
          } else {
            console.warn(`⚠️  Loki error: ${err.message}`);
          }
        },
      })
    );
  } catch {
    console.warn('⚠️  Failed to initialize Loki transport');
  }
}

const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: appName },
  transports,
});

export default logger;
