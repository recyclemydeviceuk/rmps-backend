import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

/** General API rate limiter */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      isDev ? 10_000 : 500,
  standardHeaders: true,
  legacyHeaders:   false,
  skip:     () => isDev,
  message: { success: false, message: 'Too many requests — please try again later.' },
});

/** Stricter limiter for auth endpoints */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      isDev ? 1_000 : 20,   // raised from 10 → 20 to allow for legitimate retry attempts
  standardHeaders: true,
  legacyHeaders:   false,
  skip:     () => isDev,
  message: { success: false, message: 'Too many login attempts — please wait 15 minutes.' },
});

/** Limiter for public form submissions (newsletter, contact, warranty) */
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max:      isDev ? 1_000 : 5,
  standardHeaders: true,
  legacyHeaders:   false,
  skip:     () => isDev,
  message: { success: false, message: 'Too many submissions — please try again later.' },
});
