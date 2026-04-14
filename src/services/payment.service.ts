import axios from 'axios';
import { Order } from '../models/Order';
import { paypalConfig } from '../config/paypal';
import { env } from '../config/env';
import { NotificationService } from './notification.service';
import type { CreatePaymentDTO } from '../types/payment.types';

async function getPayPalAccessToken(): Promise<string> {
  const credentials = Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString('base64');
  const res = await axios.post(
    `${paypalConfig.baseUrl}/v1/oauth2/token`,
    'grant_type=client_credentials',
    { headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' } },
  );
  return res.data.access_token as string;
}

/**
 * Verifies a PayPal webhook event using PayPal's own verification API.
 * Returns true only when PayPal confirms the signature is valid.
 *
 * Docs: https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
 */
async function verifyPayPalWebhookSignature(
  rawBody: Buffer,
  headers: Record<string, string | string[] | undefined>,
): Promise<boolean> {
  // If no webhook ID is configured, skip verification (dev/test only)
  if (!env.PAYPAL_WEBHOOK_ID) {
    if (env.NODE_ENV === 'production') {
      throw Object.assign(
        new Error('PAYPAL_WEBHOOK_ID is not configured — webhook rejected in production'),
        { statusCode: 400 },
      );
    }
    return true; // allow in dev/test when not configured
  }

  const accessToken = await getPayPalAccessToken();

  const verifyRes = await axios.post(
    `${paypalConfig.baseUrl}/v1/notifications/verify-webhook-signature`,
    {
      auth_algo:         headers['paypal-auth-algo'],
      cert_url:          headers['paypal-cert-url'],
      transmission_id:   headers['paypal-transmission-id'],
      transmission_sig:  headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id:        env.PAYPAL_WEBHOOK_ID,
      webhook_event:     JSON.parse(rawBody.toString('utf8')),
    },
    { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } },
  );

  return verifyRes.data?.verification_status === 'SUCCESS';
}

export class PaymentService {
  static async createPayPalOrder(dto: CreatePaymentDTO) {
    const { orderId, amount, currency = 'GBP', returnUrl, cancelUrl } = dto;

    const accessToken = await getPayPalAccessToken();
    const res = await axios.post(
      `${paypalConfig.baseUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [{ reference_id: orderId, amount: { currency_code: currency, value: amount.toFixed(2) } }],
        application_context: { return_url: returnUrl, cancel_url: cancelUrl },
      },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } },
    );

    // Store PayPal order ID on our order
    await Order.findByIdAndUpdate(orderId, { paypalOrderId: res.data.id });

    const approveLink = (res.data.links as { rel: string; href: string }[]).find(l => l.rel === 'approve');
    return { paypalOrderId: res.data.id as string, approveUrl: approveLink?.href };
  }

  static async capturePayPalOrder(paypalOrderId: string, orderId: string) {
    const accessToken = await getPayPalAccessToken();
    const res = await axios.post(
      `${paypalConfig.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } },
    );

    if (res.data.status === 'COMPLETED') {
      const updated = await Order.findByIdAndUpdate(orderId, { status: 'paid', paymentStatus: 'paid' }, { new: true });
      if (updated) {
        NotificationService.paymentReceived(
          updated.orderNumber,
          updated.total,
          updated._id.toString(),
        ).catch(() => {});
      }
    }

    return { status: res.data.status as string, orderId };
  }

  static async getStatus(orderId: string) {
    const order = await Order.findById(orderId).select('status paymentStatus orderNumber total');
    if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    return order;
  }

  /**
   * Handles a verified PayPal webhook event.
   * The raw body + request headers must be passed so we can call
   * PayPal's verify-webhook-signature API before touching any data.
   */
  static async handleWebhook(
    rawBody: Buffer,
    headers: Record<string, string | string[] | undefined>,
    payload: { event_type: string; resource: { id: string; status: string } },
  ) {
    // ── Signature verification (prevents forged webhook attacks) ──────────
    const isValid = await verifyPayPalWebhookSignature(rawBody, headers);
    if (!isValid) {
      throw Object.assign(new Error('Invalid webhook signature'), { statusCode: 400 });
    }

    // ── Process verified event ────────────────────────────────────────────
    if (payload.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const order = await Order.findOneAndUpdate(
        { paypalOrderId: payload.resource.id },
        { status: 'paid', paymentStatus: 'paid' },
        { new: true },
      );
      if (order) {
        NotificationService.paymentReceived(order.orderNumber, order.total, order._id.toString()).catch(() => {});
      }
    }
    if (payload.event_type === 'PAYMENT.CAPTURE.REFUNDED') {
      const order = await Order.findOneAndUpdate(
        { paypalOrderId: payload.resource.id },
        { status: 'refunded', paymentStatus: 'refunded' },
        { new: true },
      );
      if (order) {
        NotificationService.orderStatusChanged(order.orderNumber, 'refunded', order._id.toString()).catch(() => {});
      }
    }
  }
}
