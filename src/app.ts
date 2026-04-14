import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsConfig } from './config/cors';
import { apiRouter } from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    // Strict Transport Security — tell browsers to always use HTTPS
    hsts: {
      maxAge:            63_072_000, // 2 years
      includeSubDomains: true,
      preload:           true,
    },
    // Block browsers from sniffing MIME types
    noSniff: true,
    // Prevent clickjacking
    frameguard: { action: 'deny' },
    // Disable X-Powered-By (don't advertise Express)
    hidePoweredBy: true,
    // Content Security Policy — backend API only, no scripts/frames needed
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    // Referrer policy
    referrerPolicy: { policy: 'no-referrer' },
  }),
);

app.use(corsConfig);

// ── Webhook route MUST receive the raw body buffer ────────────────────────────
// Mount this BEFORE the global express.json() middleware so the JSON parser
// doesn't consume the raw bytes that PayPal's signature verification needs.
app.use(
  '/api/payment/webhook/paypal',
  express.raw({ type: 'application/json', limit: '512kb' }),
);

// ── Body parsing (all other routes) ──────────────────────────────────────────
// 10 MB was far too generous for a JSON API — 512 KB is plenty.
app.use(express.json({ limit: '512kb' }));
app.use(express.urlencoded({ extended: true, limit: '512kb' }));

// ── Request logging ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
