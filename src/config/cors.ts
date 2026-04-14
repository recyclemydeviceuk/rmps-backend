import cors from 'cors';
import { env } from './env';

const isProd = env.NODE_ENV === 'production';

const allowedOrigins = new Set([
  env.FRONTEND_URL,
  env.ADMIN_URL,
  // Always allow localhost origins in non-production
  ...(isProd ? [] : ['http://localhost:5173', 'http://localhost:5174']),
].filter(Boolean));

export const corsConfig = cors({
  origin: (origin, callback) => {
    // In production, requests with no Origin header (e.g. server-to-server)
    // are blocked.  In development we allow them so Postman / curl still work.
    if (!origin) {
      if (isProd) {
        return callback(new Error('CORS: requests without an Origin header are not allowed in production'));
      }
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    callback(new Error(`CORS: origin "${origin}" is not allowed`));
  },
  credentials: true,
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
