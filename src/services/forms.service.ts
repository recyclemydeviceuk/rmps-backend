import { NewsletterSubmission } from '../models/NewsletterSubmission';
import { ContactSubmission } from '../models/ContactSubmission';
import { WarrantySubmission } from '../models/WarrantySubmission';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';

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
        return existing.save();
      }
      return existing; // already subscribed
    }
    return NewsletterSubmission.create({ email: data.email.toLowerCase(), source: data.source || 'footer' });
  }

  static async unsubscribe(id: string) {
    const sub = await NewsletterSubmission.findByIdAndUpdate(id, { status: 'unsubscribed' }, { new: true });
    if (!sub) throw Object.assign(new Error('Subscription not found'), { statusCode: 404 });
    return sub;
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
    return ContactSubmission.create(data);
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
    return WarrantySubmission.create(data);
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
