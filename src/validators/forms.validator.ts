import { z } from 'zod';

export const newsletterSchema = z.object({
  email:  z.string().email('Valid email required'),
  source: z.enum(['footer', 'popup', 'page']).optional().default('footer'),
});

export const contactSchema = z.object({
  name:    z.string().min(2, 'Name is required'),
  phone:   z.string().min(7, 'Valid phone number required'),
  email:   z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export const warrantySchema = z.object({
  name:           z.string().min(2, 'Name is required'),
  email:          z.string().email('Valid email required'),
  deviceBrand:    z.string().min(1, 'Device brand is required'),
  deviceModel:    z.string().min(1, 'Device model is required'),
  claimInfo:      z.string().min(20, 'Please describe your claim in detail').max(3000),
  orderReference: z.string().optional(),
});
