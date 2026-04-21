import { NewsletterSubmission } from '../models/NewsletterSubmission';
import { ContactSubmission } from '../models/ContactSubmission';
import { WarrantySubmission } from '../models/WarrantySubmission';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { EmailService } from './email.service';
import { NotificationEmailService } from './notificationEmail.service';

export class FormsService {
  // ── Newsletter ──────────────────────────────────────────
  static async getNewsletterSubmissions(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query.page as string, query.limit as string);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    const [data, total] = await Promise.all([
      NewsletterSubmission.find(filter).sort({ subscribedAt: -1 }).skip(skip).limit(limit),
      NewsletterSubmission.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(page, limit, total) };
  }

  static async subscribe(data: { email: string; source?: string }) {
    const existing = await NewsletterSubmission.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        await existing.save();

        // Admin notification: re-subscribed
        NotificationEmailService.fireIfEnabled(
          'emailOnNewsletter',
          'Newsletter Re-subscription',
          `<h2>Newsletter Re-subscription</h2><p>${data.email} has re-subscribed to the newsletter.</p>`,
        ).catch(() => {});

        return existing;
      }
      return existing; // already subscribed
    }
    const sub = await NewsletterSubmission.create({ email: data.email.toLowerCase(), source: data.source || 'footer' });

    // Admin notification: new subscriber
    NotificationEmailService.fireIfEnabled(
      'emailOnNewsletter',
      'New Newsletter Subscriber',
      `
        <h2>New Newsletter Subscriber</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Source:</strong> ${data.source || 'footer'}</p>
      `,
    ).catch(() => {});

    return sub;
  }

  static async unsubscribe(id: string) {
    const sub = await NewsletterSubmission.findByIdAndUpdate(id, { status: 'unsubscribed' }, { new: true });
    if (!sub) throw Object.assign(new Error('Subscription not found'), { statusCode: 404 });
    return sub;
  }

  static async deleteNewsletter(id: string) {
    const sub = await NewsletterSubmission.findByIdAndDelete(id);
    if (!sub) throw Object.assign(new Error('Subscription not found'), { statusCode: 404 });
  }

  // ── Contact ─────────────────────────────────────────────
  static async getContactSubmissions(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query.page as string, query.limit as string);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    const [data, total] = await Promise.all([
      ContactSubmission.find(filter).sort({ submittedAt: -1 }).skip(skip).limit(limit),
      ContactSubmission.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(page, limit, total) };
  }

  static async getContactById(id: string) {
    const sub = await ContactSubmission.findByIdAndUpdate(id, { status: 'read' }, { new: true });
    if (!sub) throw Object.assign(new Error('Submission not found'), { statusCode: 404 });
    return sub;
  }

  static async submitContact(data: unknown) {
    const sub = await ContactSubmission.create(data);

    const d = data as { name?: string; email?: string; phone?: string; message?: string };

    // Admin notification (non-blocking)
    NotificationEmailService.fireIfEnabled(
      'emailOnContactForm',
      `New Contact Form Submission — ${d.name ?? 'Unknown'}`,
      `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${d.name ?? '-'}</p>
        <p><strong>Email:</strong> ${d.email ?? '-'}</p>
        <p><strong>Phone:</strong> ${d.phone ?? '-'}</p>
        <p><strong>Message:</strong></p>
        <p>${d.message ?? '-'}</p>
      `,
    ).catch(() => {});

    // Customer acknowledgement (non-blocking)
    if (d.email && d.name) {
      EmailService.sendContactAcknowledgement(d.email, d.name).catch(() => {});
    }

    return sub;
  }

  static async updateContactStatus(id: string, status: string) {
    const sub = await ContactSubmission.findByIdAndUpdate(id, { status }, { new: true });
    if (!sub) throw Object.assign(new Error('Submission not found'), { statusCode: 404 });
    return sub;
  }

  static async deleteContact(id: string) {
    const sub = await ContactSubmission.findByIdAndDelete(id);
    if (!sub) throw Object.assign(new Error('Submission not found'), { statusCode: 404 });
  }

  // ── Warranty ─────────────────────────────────────────────
  static async getWarrantySubmissions(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query.page as string, query.limit as string);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    const [data, total] = await Promise.all([
      WarrantySubmission.find(filter).sort({ submittedAt: -1 }).skip(skip).limit(limit),
      WarrantySubmission.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(page, limit, total) };
  }

  static async getWarrantyById(id: string) {
    const sub = await WarrantySubmission.findById(id);
    if (!sub) throw Object.assign(new Error('Claim not found'), { statusCode: 404 });
    return sub;
  }

  static async submitWarranty(data: unknown) {
    const sub = await WarrantySubmission.create(data);

    const d = data as { name?: string; email?: string; phone?: string; orderNumber?: string; issueDescription?: string };

    // Admin notification (non-blocking)
    NotificationEmailService.fireIfEnabled(
      'emailOnWarrantyClaim',
      `New Warranty Claim — ${d.orderNumber ?? 'Unknown Order'}`,
      `
        <h2>New Warranty Claim Submitted</h2>
        <p><strong>Name:</strong> ${d.name ?? '-'}</p>
        <p><strong>Email:</strong> ${d.email ?? '-'}</p>
        <p><strong>Phone:</strong> ${d.phone ?? '-'}</p>
        <p><strong>Order Number:</strong> ${d.orderNumber ?? '-'}</p>
        <p><strong>Issue:</strong></p>
        <p>${d.issueDescription ?? '-'}</p>
      `,
    ).catch(() => {});

    // Customer acknowledgement (non-blocking)
    if (d.email && d.name) {
      EmailService.sendWarrantyAcknowledgement(d.email, d.name).catch(() => {});
    }

    return sub;
  }

  static async updateWarrantyStatus(id: string, status: string) {
    const sub = await WarrantySubmission.findByIdAndUpdate(id, { status }, { new: true });
    if (!sub) throw Object.assign(new Error('Claim not found'), { statusCode: 404 });
    return sub;
  }

  static async deleteWarranty(id: string) {
    const sub = await WarrantySubmission.findByIdAndDelete(id);
    if (!sub) throw Object.assign(new Error('Claim not found'), { statusCode: 404 });
  }
}
