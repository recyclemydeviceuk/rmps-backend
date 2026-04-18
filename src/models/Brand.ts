import { Schema, model, Document, Types } from 'mongoose';

export interface IBrandDoc extends Document {
  deviceTypeId:      Types.ObjectId;
  deviceTypeName:    string;
  name:              string;
  slug:              string;
  logoUrl?:          string;
  showcaseImageUrl?: string;
  modelCount:        number;
  hasSeries:         boolean;
  isActive:          boolean;
}

const schema = new Schema<IBrandDoc>(
  {
    deviceTypeId:     { type: Schema.Types.ObjectId, ref: 'DeviceType', required: true },
    deviceTypeName:   { type: String, required: true },
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true },
    logoUrl:          { type: String },
    showcaseImageUrl: { type: String },
    modelCount:       { type: Number, default: 0 },
    hasSeries:        { type: Boolean, default: false },
    isActive:         { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Fast filter for "brands of a given device type"
schema.index({ deviceTypeId: 1, isActive: 1, name: 1 });
schema.index({ slug: 1, isActive: 1 });

export const Brand = model<IBrandDoc>('Brand', schema);
