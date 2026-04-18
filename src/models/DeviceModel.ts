import { Schema, model, Document, Types } from 'mongoose';

export interface IDeviceModelDoc extends Document {
  deviceTypeId:   Types.ObjectId;
  deviceTypeName: string;
  brandId:        Types.ObjectId;
  brandName:      string;
  seriesId?:      Types.ObjectId;
  seriesName?:    string;
  name:           string;
  slug:           string;
  imageUrl?:      string;
  repairCount:    number;
  releaseYear?:   number;
  isActive:       boolean;
}

const schema = new Schema<IDeviceModelDoc>(
  {
    deviceTypeId:   { type: Schema.Types.ObjectId, ref: 'DeviceType', required: true },
    deviceTypeName: { type: String, required: true },
    brandId:        { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    brandName:      { type: String, required: true },
    seriesId:       { type: Schema.Types.ObjectId, ref: 'Series' },
    seriesName:     { type: String },
    name:           { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, lowercase: true },
    imageUrl:       { type: String },
    repairCount:    { type: Number, default: 0 },
    releaseYear:    { type: Number },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true },
);

// ── Indexes for fast public catalog queries ─────────────────────────────────
// Compound: most frequent query is "all active models for a brand (& optional series)"
schema.index({ brandId: 1, isActive: 1, name: 1 });
schema.index({ brandId: 1, seriesId: 1, isActive: 1, name: 1 });
// Search-by-slug (slug is already unique but adding for explicitness when combined with isActive)
schema.index({ slug: 1, isActive: 1 });
// For case-insensitive model name searches triggered by the search-bar
schema.index({ name: 'text', brandName: 'text' });

export const DeviceModel = model<IDeviceModelDoc>('DeviceModel', schema);
