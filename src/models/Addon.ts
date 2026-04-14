import { Schema, model, Document } from 'mongoose';

const ADDON_CATEGORIES = ['protection', 'warranty', 'delivery', 'accessory'] as const;

export interface IAddonDoc extends Document {
  name:        string;
  description: string;
  category:    typeof ADDON_CATEGORIES[number];
  price:       number;
  isActive:    boolean;
  isRequired:  boolean;
  imageUrl?:   string;
  sortOrder:   number;
}

const schema = new Schema<IAddonDoc>(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category:    { type: String, enum: ADDON_CATEGORIES, required: true },
    price:       { type: Number, required: true, min: 0 },
    isActive:    { type: Boolean, default: true },
    isRequired:  { type: Boolean, default: false },
    imageUrl:    { type: String },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Addon = model<IAddonDoc>('Addon', schema);
