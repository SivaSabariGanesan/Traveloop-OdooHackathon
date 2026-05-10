import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { register } from './config/metrics';
import { metricsMiddleware } from './middlewares/metricsMiddleware';
import logger from './config/logger';
import authRoutes from './routes/auth.routes';
import tripRoutes from './routes/trip.routes';
import itineraryRoutes from './routes/itinerary.routes';
import geminiRoutes from './routes/gemini.routes';
import noteRoutes from './routes/note.routes';
import checklistRoutes from './routes/checklist.routes';
import communityRoutes from './routes/community.routes';
import invoiceRoutes from './routes/invoice.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Production style with explicit allowed origins
const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // React/Next.js dev server
  'http://localhost:5000', // Backend server (for Swagger UI)
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(morgan('combined', {
  stream: { write: (msg) => logger.http(msg.trim()) },
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(metricsMiddleware);

// Prometheus metrics endpoint — scraped by Prometheus
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Swagger documentation routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Backend API Docs',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Static files - uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips/:tripId/stops', itineraryRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/trips/:tripId/notes', noteRoutes);
app.use('/api/trips/:tripId/checklist', checklistRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/trips/:tripId/invoice', invoiceRoutes);
app.use('/api/admin', adminRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
