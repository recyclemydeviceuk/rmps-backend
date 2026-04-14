import { Schema, model, Document } from 'mongoose';

export interface IWarrantyDoc extends Document {
  name:            string;
  email:           string;
  deviceBrand:     string;
  deviceModel:     string;
  claimInfo:       string;
  orderReference?: string;
  status:          'pending' | 'approved' | 'rejected' | 'resolved';
  submittedAt:     Date;
}

const schema = new Schema<IWarrantyDoc>({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, lowercase: true, trim: true },
  deviceBrand:    { type: String, required: true },
  deviceModel:    { type: String, required: true },
  claimInfo:      { type: String, required: true },
  orderReference: { type: String },
  status:         { type: String, enum: ['pending', 'approved', 'rejected', 'resolved'], default: 'pending' },
  submittedAt:    { type: Date, default: Date.now },
});

export const WarrantySubmission = model<IWarrantyDoc>('WarrantySubmission', schema);
