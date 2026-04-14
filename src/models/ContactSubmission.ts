import { Schema, model, Document } from 'mongoose';

export interface IContactDoc extends Document {
  name:        string;
  phone:       string;
  email:       string;
  message:     string;
  status:      'new' | 'read' | 'replied';
  submittedAt: Date;
}

const schema = new Schema<IContactDoc>({
  name:        { type: String, required: true, trim: true },
  phone:       { type: String, required: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  message:     { type: String, required: true },
  status:      { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  submittedAt: { type: Date, default: Date.now },
});

export const ContactSubmission = model<IContactDoc>('ContactSubmission', schema);
