import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType =
  | 'new_order'
  | 'payment_received'
  | 'payment_failed'
  | 'order_completed'
  | 'order_cancelled'
  | 'order_processing'
  | 'order_refunded';

export interface INotificationDoc extends Document {
  type:        NotificationType;
  title:       string;
  message:     string;
  orderId?:    Types.ObjectId;
  orderNumber?: string;
  read:        boolean;
  createdAt:   Date;
}

const schema = new Schema<INotificationDoc>(
  {
    type:        { type: String, required: true },
    title:       { type: String, required: true },
    message:     { type: String, required: true },
    orderId:     { type: Schema.Types.ObjectId, ref: 'Order' },
    orderNumber: { type: String },
    read:        { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Keep only last 200 notifications — auto-clean oldest when inserting
schema.index({ createdAt: -1 });

export const Notification = model<INotificationDoc>('Notification', schema);
