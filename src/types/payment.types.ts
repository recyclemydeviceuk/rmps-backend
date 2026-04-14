export type PaymentProvider = 'paypal';

export interface PayPalOrderResponse {
  id:     string;
  status: string;
  links:  { href: string; rel: string; method: string }[];
}

export interface CreatePaymentDTO {
  orderId:  string;
  amount:   number;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentWebhookPayload {
  event_type:   string;
  resource:     { id: string; status: string; [key: string]: unknown };
  create_time:  string;
}
