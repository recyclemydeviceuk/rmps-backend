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

export const Series = model<ISeriesDoc>('Series', schema);
