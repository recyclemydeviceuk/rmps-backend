import { Schema, model, Document } from 'mongoose';

export interface IPromoCodeDoc extends Document {
  code:        string;
  discount:    number;   // decimal e.g. 0.10 = 10%
  label:       string;
  isActive:    boolean;
  usageLimit?: number;
  usageCount:  number;
  expiresAt?:  Date;
}

const schema = new Schema<IPromoCodeDoc>(
  {
    code:       { type: String, required: true, unique: true, uppercase: true, trim: true },
    discount:   { type: Number, required: true, min: 0, max: 1 },
    label:      { type: String, required: true },
    isActive:   { type: Boolean, default: true },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
    expiresAt:  { type: Date },
  },
  { timestamps: true },
);

export const PromoCode = model<IPromoCodeDoc>('PromoCode', schema);
