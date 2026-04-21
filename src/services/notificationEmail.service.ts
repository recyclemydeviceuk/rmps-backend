/**
 * NotificationEmailService
 *
 * Fetches the live notification settings from the DB and provides a
 * single method — `fireIfEnabled` — that checks a toggle flag before
 * actually sending an email.  All calls are non-blocking; errors are
 * swallowed so that a broken email config never fails a user-facing request.
 */

import { Settings } from '../models/Settings';
import { EmailService } from './email.service';
import { logger } from '../utils/logger';

export class NotificationEmailService {
  /**
   * Send an email only when the named toggle is enabled in the DB.
   *
   * @param toggle   One of the five notification boolean fields
   * @param subject  Email subject line
   * @param html     Email body HTML
   * @param to       Override recipient — defaults to settings.general.email
   */
  static async fireIfEnabled(
    toggle: 'emailOnNewOrder' | 'emailOnOrderComplete' | 'emailOnWarrantyClaim' | 'emailOnContactForm' | 'emailOnNewsletter',
    subject: string,
    html: string,
    to?: string,
  ): Promise<void> {
    try {
      const settings = await Settings.findOne().lean();
      const notif = settings?.notifications;
      if (!notif) return;

      if (!notif[toggle]) return; // disabled in admin panel

      const adminEmail = to ?? settings?.general?.email;
      await EmailService.sendAdminNotification(subject, html, adminEmail || undefined);
    } catch (err) {
      logger.error('NotificationEmailService.fireIfEnabled error:', err);
    }
  }

  /**
   * Convenience: fetch the admin notify email from settings.
   */
  static async getAdminEmail(): Promise<string> {
    try {
      const settings = await Settings.findOne().lean();
      return settings?.general?.email ?? '';
    } catch {
      return '';
    }
  }
}
