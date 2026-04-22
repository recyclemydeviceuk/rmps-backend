import { SendEmailCommand } from '@aws-sdk/client-ses';
import { sesClient } from '../config/ses';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// "Repair My Phone Screen" <mailer@zennara.in>
const FROM = `"${env.AWS_SES_FROM_NAME}" <${env.AWS_SES_FROM_EMAIL}>`;

async function send(to: string | string[], subject: string, html: string): Promise<void> {
  const toAddresses = Array.isArray(to) ? to : [to];
  await sesClient.send(
    new SendEmailCommand({
      Source:      FROM,
      Destination: { ToAddresses: toAddresses },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body:    { Html: { Data: html,    Charset: 'UTF-8' } },
      },
    }),
  );
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
    logger.info(`Order confirmation sent via SES to ${to} for ${orderNumber}`);
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
    // Recipient is always passed by NotificationEmailService (settings.general.email).
    // If it's missing, we skip silently rather than send to a stale env value.
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
}
