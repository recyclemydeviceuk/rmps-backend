import { Schema, model, Document } from 'mongoose';

const CUSTOMER_STATUSES = ['active', 'inactive', 'banned'] as const;

const addressSchema = new Schema({
  street:   { type: String },
  city:     { type: String },
  postcode: { type: String },
  country:  { type: String, default: 'United Kingdom' },
}, { _id: false });

export interface ICustomerDoc extends Document {
  name:           string;
  email:          string;
  phone:          string;
  status:         typeof CUSTOMER_STATUSES[number];
  address?:       { street?: string; city?: string; postcode?: string; country?: string };
  totalOrders:    number;
  totalSpent:     number;
  lastOrderDate?: Date;
}

const schema = new Schema<ICustomerDoc>(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:         { type: String, required: true },
    status:        { type: String, enum: CUSTOMER_STATUSES, default: 'active' },
    address:       addressSchema,
    totalOrders:   { type: Number, default: 0 },
    totalSpent:    { type: Number, default: 0 },
    lastOrderDate: { type: Date },
  },
  { timestamps: true },
);

export const Customer = model<ICustomerDoc>('Customer', schema);
