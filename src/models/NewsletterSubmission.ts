import { Schema, model, Document } from 'mongoose';

export interface INewsletterDoc extends Document {
  email:        string;
  source:       'footer' | 'popup' | 'page';
  status:       'active' | 'unsubscribed';
  subscribedAt: Date;
}

const schema = new Schema<INewsletterDoc>({
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  source:       { type: String, enum: ['footer', 'popup', 'page'], default: 'footer' },
  status:       { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
  subscribedAt: { type: Date, default: Date.now },
});

export const NewsletterSubmission = model<INewsletterDoc>('NewsletterSubmission', schema);
