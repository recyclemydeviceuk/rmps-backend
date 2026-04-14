export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface IOrderItem {
  repairType:   string;
  deviceModel:  string;
  description:  string;
  quantity:     number;
  unitPrice:    number;
  totalPrice:   number;
}

export interface IOrderNote {
  _id:       string;
  text:      string;
  createdAt: Date;
}

export interface IOrder {
  _id:             string;
  orderNumber:     string;
  customerId?:     string;
  customerName:    string;
  customerEmail:   string;
  customerPhone:   string;
  device:          string;
  brand:           string;
  model:           string;
  repairType:      string;
  items:           IOrderItem[];
  subtotal:        number;
  discount:        number;
  tax:             number;
  total:           number;
  status:          OrderStatus;
  paymentMethod:   'paypal';
  paymentStatus:   PaymentStatus;
  paypalOrderId?:  string;
  notes:           IOrderNote[];
  createdAt:       Date;
  updatedAt:       Date;
  completedAt?:    Date;
}
