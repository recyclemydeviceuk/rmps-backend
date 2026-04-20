import { Schema, model, Document } from 'mongoose';

export interface IDeviceTypeDoc extends Document {
  name:       string;
  slug:       string;
  subtitle?:  string;  // Short tagline shown under the name (e.g. "All iPhone models")
  imageUrl?:  string;
  brandCount: number;
  isActive:   boolean;
}

const schema = new Schema<IDeviceTypeDoc>(
  {
    name:       { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true, lowercase: true },
    subtitle:   { type: String, trim: true },
    imageUrl:   { type: String },
    brandCount: { type: Number, default: 0 },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const DeviceType = model<IDeviceTypeDoc>('DeviceType', schema);
