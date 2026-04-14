import { env } from './env';

// PayPal REST API base URL
export const PAYPAL_BASE_URL =
  env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

export const paypalConfig = {
  clientId:     env.PAYPAL_CLIENT_ID,
  clientSecret: env.PAYPAL_CLIENT_SECRET,
  mode:         env.PAYPAL_MODE as 'sandbox' | 'live',
  baseUrl:      PAYPAL_BASE_URL,
};

// TODO: Initialise PayPal SDK here once @paypal/checkout-server-sdk is installed
