import { z } from 'zod';

const orderItemSchema = z.object({
  repairTypeId:  z.string().min(1).max(100),
  repairTypeName: z.string().max(200),
  modelId:       z.string().min(1).max(100),
  modelName:     z.string().max(200),
  quantity:      z.number().int().min(1).max(10).default(1),
  // Client-provided price is accepted here but verified against the DB
  // inside CheckoutService — a mismatch throws a 400.
  unitPrice:     z.number().min(0).max(9999),
});

const addonItemSchema = z.object({
  addonId:  z.string().min(1).max(100),
  name:     z.string().max(200),
  price:    z.number().min(0).max(999),
});

export const checkoutSchema = z.object({
  customerName:  z.string().min(2, 'Full name is required').max(100),
  customerEmail: z.string().email('Valid email required').max(254),
  customerPhone: z.string().min(7, 'Valid phone number required').max(30),
  device:        z.string().min(1, 'Device type is required').max(50),
  brand:         z.string().min(1, 'Brand is required').max(100),
  model:         z.string().min(1, 'Model is required').max(200),
  repairType:    z.string().min(1, 'Repair type is required').max(200),
  postageType:   z.enum(['print-label', 'send-pack', 'collection'], { errorMap: () => ({ message: 'Valid postage type is required' }) }),
  // For 'collection' (Preston area only), a full collection address is required
  collectionAddress: z.string().min(5).max(300).optional(),
  collectionPostcode: z.string().min(3).max(20).optional(),
  items:         z.array(orderItemSchema).min(1, 'At least one item required').max(20),
  addons:        z.array(addonItemSchema).max(10).optional().default([]),
});
