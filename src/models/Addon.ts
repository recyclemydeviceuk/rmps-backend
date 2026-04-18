import { Schema, model, Document } from 'mongoose';

const ADDON_CATEGORIES = ['protection', 'warranty', 'delivery', 'accessory', 'other'] as const;

export interface IAddonColorOption {
  name:    string; // Human-readable name, e.g. "Midnight Blue"
  hex:     string; // CSS-compatible colour value, e.g. "#1e3a8a"
  imageUrl?: string; // Optional product photo in this colour
}

export interface IAddonDoc extends Document {
  name:        string;
  description: string;
  category:    typeof ADDON_CATEGORIES[number];
  price:       number;
  isActive:    boolean;
  isRequired:  boolean;
  imageUrl?:   string;
  sortOrder:   number;
  colors:      IAddonColorOption[];
}

const colorOptionSchema = new Schema<IAddonColorOption>(
  {
    name:     { type: String, required: true, trim: true },
    hex:      { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
  },
  { _id: false },
);

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
    // Optional colour variants — when present, customers must pick one at checkout.
    // Leave empty for add-ons with no colour choice (e.g. screen protector, delivery).
    colors:      { type: [colorOptionSchema], default: [] },
  },
  { timestamps: true },
);

export const Addon = model<IAddonDoc>('Addon', schema);
