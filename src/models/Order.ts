import { Schema, model, Document, Types } from 'mongoose';

const ORDER_STATUSES   = ['pending', 'paid', 'processing', 'completed', 'failed', 'refunded', 'cancelled'] as const;
const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'] as const;
const POSTAGE_TYPES    = ['print-label', 'send-pack'] as const;

const orderItemSchema = new Schema({
  repairType:  { type: String, required: true },
  deviceModel: { type: String, required: true },
  description: { type: String },
  quantity:    { type: Number, required: true, min: 1, default: 1 },
  unitPrice:   { type: Number, required: true },
  totalPrice:  { type: Number, required: true },
}, { _id: false });

const orderNoteSchema = new Schema({
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface IOrderDoc extends Omit<Document, 'model'> {
  orderNumber:    string;
  customerId?:    Types.ObjectId;
  customerName:   string;
  customerEmail:  string;
  customerPhone:  string;
  device:         string;
  brand:          string;
  model:          string;
  repairType:     string;
  postageType:    typeof POSTAGE_TYPES[number];
  items:          { repairType: string; deviceModel: string; description?: string; quantity: number; unitPrice: number; totalPrice: number }[];
  subtotal:       number;
  discount:       number;
  tax:            number;
  total:          number;
  status:         typeof ORDER_STATUSES[number];
  paymentMethod:  'paypal';
  paymentStatus:  typeof PAYMENT_STATUSES[number];
  paypalOrderId?: string;
  notes:          { text: string; createdAt: Date }[];
  completedAt?:   Date;
}

const schema = new Schema<IOrderDoc>(
  {
    orderNumber:   { type: String, required: true, unique: true },
    customerId:    { type: Schema.Types.ObjectId, ref: 'Customer' },
    customerName:  { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    customerPhone: { type: String, required: true },
    device:        { type: String, required: true },
    brand:         { type: String, required: true },
    model:         { type: String, required: true },
    repairType:    { type: String, required: true },
    postageType:   { type: String, enum: POSTAGE_TYPES, required: true },
    items:         [orderItemSchema],
    subtotal:      { type: Number, required: true },
    discount:      { type: Number, default: 0 },
    tax:           { type: Number, default: 0 },
    total:         { type: Number, required: true },
    status:        { type: String, enum: ORDER_STATUSES, default: 'pending' },
    paymentMethod: { type: String, enum: ['paypal'], default: 'paypal' },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: 'unpaid' },
    paypalOrderId: { type: String },
    notes:         [orderNoteSchema],
    completedAt:   { type: Date },
  },
  { timestamps: true },
);

export const Order = model<IOrderDoc>('Order', schema);
