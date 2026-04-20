import { Schema, model, Document } from 'mongoose';

const REPAIR_CATEGORIES = ['screen', 'battery', 'camera', 'back_glass', 'charging_port', 'speaker', 'other'] as const;

// Single standard warranty across the whole site — kept as a 1-item
// tuple rather than a plain string so the rest of the codebase keeps
// working through the existing enum type.
export const WARRANTY_OPTIONS = ['12 Months'] as const;
export type WarrantyOption = typeof WARRANTY_OPTIONS[number];

export interface IRepairTypeDoc extends Document {
  name:         string;
  slug:         string;
  category:     typeof REPAIR_CATEGORIES[number];
  description?: string;
  warranty?:    WarrantyOption;
  imageUrl?:    string;
  isActive:     boolean;
}

const schema = new Schema<IRepairTypeDoc>(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    category:    { type: String, enum: REPAIR_CATEGORIES, required: true },
    description: { type: String },
    warranty:    { type: String, enum: [...WARRANTY_OPTIONS, ''] },
    imageUrl:    { type: String },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const RepairType = model<IRepairTypeDoc>('RepairType', schema);
