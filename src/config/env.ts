import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT:     process.env.PORT     || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // ── MongoDB ─────────────────────────────────────────────
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/repairmyphonescreen',

  // ── JWT ──────────────────────────────────────────────────
  JWT_SECRET:     process.env.JWT_SECRET     || 'dev_jwt_secret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // ── Admin ────────────────────────────────────────────────
  // Admins themselves live in the `adminusers` collection (see AdminUser model).
  // ADMIN_CREATE_KEY gates the createAdminUser script — required to create or
  // reset an admin. Must match the SHA-256 hash baked into that script.
  ADMIN_CREATE_KEY: process.env.ADMIN_CREATE_KEY || '',

  // ── AWS S3 (Image Storage) ───────────────────────────────
  AWS_S3_ACCESS_KEY_ID:     process.env.AWS_S3_ACCESS_KEY_ID     || '',
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
  AWS_S3_REGION:            process.env.AWS_S3_REGION            || 'ap-south-1',
  AWS_S3_BUCKET_NAME:       process.env.AWS_S3_BUCKET_NAME       || '',
  AWS_S3_PUBLIC_BASE_URL:   (process.env.AWS_S3_PUBLIC_BASE_URL  || '').replace(/\/$/, ''),

  // ── AWS SES (Email) ──────────────────────────────────────
  AWS_ACCESS_KEY_ID:     process.env.AWS_ACCESS_KEY_ID     || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_SES_REGION:        process.env.AWS_SES_REGION        || 'ap-south-1',
  AWS_SES_FROM_EMAIL:    process.env.AWS_SES_FROM_EMAIL    || 'noreply@repairmyphonescreen.co.uk',
  AWS_SES_FROM_NAME:     process.env.AWS_SES_FROM_NAME     || 'Repair My Phone Screen',

  // ── PayPal ───────────────────────────────────────────────
  PAYPAL_CLIENT_ID:     process.env.PAYPAL_CLIENT_ID     || '',
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || '',
  PAYPAL_MODE:          process.env.PAYPAL_MODE          || 'sandbox',
  // Webhook ID from the PayPal developer dashboard — required for signature verification
  PAYPAL_WEBHOOK_ID:    process.env.PAYPAL_WEBHOOK_ID    || '',

  // ── Frontend URLs (CORS) ─────────────────────────────────
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ADMIN_URL:    process.env.ADMIN_URL    || 'http://localhost:5174',
};

// ── Startup validation ───────────────────────────────────────────────────────
// Fail fast in production if any critical env var is missing or using a
// known-insecure default value.
if (env.NODE_ENV === 'production') {
  const missing: string[] = [];

  if (!env.MONGODB_URI || env.MONGODB_URI.includes('localhost'))       missing.push('MONGODB_URI');
  if (!env.JWT_SECRET || env.JWT_SECRET === 'dev_jwt_secret_change_in_production') missing.push('JWT_SECRET');
  if (!env.PAYPAL_CLIENT_ID)                                             missing.push('PAYPAL_CLIENT_ID');
  if (!env.PAYPAL_CLIENT_SECRET)                                         missing.push('PAYPAL_CLIENT_SECRET');
  if (!env.PAYPAL_WEBHOOK_ID) {
    console.warn('[env] ⚠️  PAYPAL_WEBHOOK_ID is not set — PayPal webhook signature verification is DISABLED');
  }
  if (!env.FRONTEND_URL || env.FRONTEND_URL.includes('localhost'))       missing.push('FRONTEND_URL');
  if (!env.ADMIN_URL    || env.ADMIN_URL.includes('localhost'))          missing.push('ADMIN_URL');

  if (missing.length > 0) {
    console.error(`\n[env] ❌ Missing or insecure required environment variables in production:\n  ${missing.join('\n  ')}\n`);
    process.exit(1);
  }
}
