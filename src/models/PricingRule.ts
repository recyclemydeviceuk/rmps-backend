import { Schema, model, Document, Types } from 'mongoose';

export interface IPricingRuleDoc extends Document {
  modelId:        Types.ObjectId;
  modelName:      string;
  brandName:      string;
  repairTypeId:   Types.ObjectId;
  repairTypeName: string;
  category:       string;
  price:          number;
  description?:   string;
  warranty?:      string;
  turnaround?:    string;
  isActive:       boolean;
}

// `strict: 'throw'` would reject legacy `originalPrice` values already in the
// DB; we keep the default `strict: true` which just ignores unknown fields.
const schema = new Schema<IPricingRuleDoc>(
  {
    modelId:        { type: Schema.Types.ObjectId, ref: 'DeviceModel', required: true },
    modelName:      { type: String, required: true },
    brandName:      { type: String, required: true },
    repairTypeId:   { type: Schema.Types.ObjectId, ref: 'RepairType', required: true },
    repairTypeName: { type: String, required: true },
    category:       { type: String, required: true },
    price:          { type: Number, required: true, min: 0 },
    description:    { type: String },
    warranty:       { type: String },
    turnaround:     { type: String },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Unique constraint: one price per model+repairType combination
schema.index({ modelId: 1, repairTypeId: 1 }, { unique: true });
// Fast lookup of "all active pricing rules for a given model"
schema.index({ modelId: 1, isActive: 1 });

export const PricingRule = model<IPricingRuleDoc>('PricingRule', schema);
