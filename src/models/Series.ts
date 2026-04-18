import { Schema, model, Document, Types } from 'mongoose';

export interface ISeriesDoc extends Document {
  brandId:    Types.ObjectId;
  brandName:  string;
  name:       string;
  slug:       string;
  modelCount: number;
  isActive:   boolean;
}

const schema = new Schema<ISeriesDoc>(
  {
    brandId:    { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    brandName:  { type: String, required: true },
    name:       { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true, lowercase: true },
    modelCount: { type: Number, default: 0 },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Indexes for fast public-catalog lookups
schema.index({ brandId: 1, isActive: 1, name: 1 });
schema.index({ slug: 1, brandId: 1 });

export const Series = model<ISeriesDoc>('Series', schema);
