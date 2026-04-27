import { brevoClient } from '../config/brevo';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const sender = { name: env.FROM_NAME_Brevo, email: env.FROM_EMAIL_Brevo };

async function send(to: string | string[], subject: string, htmlContent: string): Promise<void> {
  const toAddresses = (Array.isArray(to) ? to : [to]).map(email => ({ email }));
  await brevoClient.post('/smtp/email', { sender, to: toAddresses, subject, htmlContent });
}

export class EmailService {
  static async sendOrderConfirmation(to: string, orderNumber: string, total: number) {
    await send(
      to,
      `Order Confirmed — ${orderNumber}`,
      `
        <h2>Thank you for your order!</h2>
        <p>Your order <strong>${orderNumber}</strong> has been received.</p>
        <p>Total: <strong>£${total.toFixed(2)}</strong></p>
        <p>We'll be in touch once your repair is ready.</p>
      `,
    );
    logger.info(`Order confirmation sent via Brevo to ${to} for ${orderNumber}`);
  }

  static async sendOrderStatusUpdate(to: string, orderNumber: string, status: string) {
    await send(
      to,
      `Your Repair Status Update — ${orderNumber}`,
      `
        <h2>Repair Status Update</h2>
        <p>Your order <strong>${orderNumber}</strong> has been updated to: <strong>${status}</strong>.</p>
      `,
    );
  }

  static async sendAdminNotification(subject: string, html: string, to?: string) {
    if (!to) return;
    await send(to, subject, html);
  }

  static async sendContactAcknowledgement(to: string, name: string) {
    await send(
      to,
      'We received your message — RepairMyPhoneScreen',
      `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out! We've received your message and will get back to you shortly.</p>
      `,
    );
  }

  static async sendWarrantyAcknowledgement(to: string, name: string) {
    await send(
      to,
      'Warranty Claim Received — RepairMyPhoneScreen',
      `
        <p>Hi ${name},</p>
        <p>We've received your warranty claim and will review it within 2 business days.</p>
        <p>We'll be in touch with next steps shortly.</p>
      `,
    );
  }

  static async sendAdminOtp(to: string, name: string, code: string) {
    await send(
      to,
      'Your Admin Login Code — RepairMyPhoneScreen',
      `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <h2 style="margin:0 0 8px;font-size:20px;color:#111827">Admin Login Code</h2>
          <p style="margin:0 0 24px;color:#6b7280;font-size:14px">Hi ${name}, use the code below to sign in. It expires in <strong>10 minutes</strong>.</p>
          <div style="letter-spacing:10px;font-size:36px;font-weight:700;color:#dc2626;text-align:center;background:#fef2f2;border-radius:12px;padding:20px 0;margin-bottom:24px">${code}</div>
          <p style="margin:0;color:#9ca3af;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    );
    logger.info(`Admin OTP sent via Brevo to ${to}`);
  }
}
